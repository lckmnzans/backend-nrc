const User = require('../model/User');
const crypto = require('crypto');
const validateRegisterInput = require('../validation/register');
const { tokenAge, jwtSecret } = require('../config/jwt');
const jwt = require('jwt-simple');
const { transporter, userMail } = require('../config/nodemailer');
const { vueUri } = require('../config/keys');

async function register(req,res) {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: errors
        });
    }

    User.findOne({email: req.body.email})
    .then(user => {
        if (user) {
            return res.status(409).json({
                success:false,
                message:{
                    email:'Alamat email sudah digunakan'
                }
            });
        } else {
            User.register(
                new User({
                    username: req.body.username,
                    email: req.body.email,
                    role: req.body.role
                }), req.body.password, (err, msg) => {
                    if (err) {
                        if (err.name == 'UserExistsError') return res.status(409).json({ success: false, message: err.message });
                        return res.status(400).json({ success: false, message: err.message });
                    } else {
                        transporter.sendMail({
                            from: 'furqon@nusarayacipta.com',
                            to: req.body.email,
                            subject: 'Your NRC-Archiving Account',
                            text: 'Akun untuk NRC-Archiving anda berhasil dibuat',
                            html:  `<p>Akun untuk NRC-Archiving anda berhasil dibuat</p>`
                        }).then(info => { console.log(info) }).catch(err => {console.log(err)});

                        return res.json({ 
                            success:true,
                            message: "Akun berhasil dibuat"
                        });
                    }
                }
            );
        }
    })
    .catch(err => {
        return res.status(500).json({ 
            success:false,
            message: err.message
         });
    });
}

async function login(req,res) {
    User.findOne({ username: req.body.username })
    .then(user => {
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: `Akun dengan username ${username} tidak ditemukan` 
            })
        } else {
            var payload = {
                id: user.id,
                role: user.role,
                expire: Date.now() + tokenAge
            }
            var token = jwt.encode(payload, jwtSecret);

            return res.json({
                success: true,
                message: 'Login berhasil',
                data: { token:token, role: user.role, id: user._id, username: user.username, email: user.email, tokenAge: payload.expire } 
            });
        }
    })
    .catch(err => {
        return res.status(500).json({ 
            success: false,
            message: err.message
        });
    });
}

async function getToProfile(req,res) {
    return res.json({
        success: true,
        message: 'Welcome, you made it to the secured profile',
        data: {
            user: req.user,
            token: req.query.secret_token
        }
    });
}

async function getAllAccounts(req,res) {
    User.find({})
    .then(accounts => {
        if (!accounts) {
            return res.status(404).json({
                success: false,
                message: 'Akun tidak ditemukan'
            })
        } else {
            return res.json({
                success: true,
                message: 'Akun berhasil diambil',
                data: { accounts }
            });
        }
    })
    .catch(err => {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    });
}

async function getAccount(req,res) {
    User.findById(req.params.id)
    .then(user => {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Akun tidak ditemukan`
            });
        } else {
            return res.json({
                success: true,
                message: `Akun berhasil didapatkan`,
                data: user
            });
        }
    })
    .catch(err => {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    });
}

const passwordValidation = require('../validation/password');
async function updateAccount(req, res) {
    const { id } = req.params;
    const { requestChange } = req.query;

    if (requestChange == 'pass') {
        const { username, oldPassword, newPassword } =  req.body;

        const checkNewPassword = passwordValidation(newPassword);
        if (checkNewPassword.error) {
            return res.status(400).json({
                success: false,
                message: checkNewPassword.message
            })
        }
    
        User.findById(id)
        .then(async user => { 
            if (!user || user.username != username) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }
            await user.changePassword(oldPassword, newPassword)
            return res.json({ 
                success: true,
                message: 'Password berhasil diganti'
            });
        })
        .catch(err => { 
            return res.status(500).json({
                success: false,
                message: err.message
            })
        });

    } else if (requestChange == 'role') {
        const { username, email, role } = req.body;
        
        const requester = req.user;
        if (requester.role != 'superadmin') {
            return res.status(401).json({
                success: false,
                message: 'Permintaan dibatalkan. Anda tidak memiliki hak akses untuk mengubah role user lain.'
            })
        }

        User.findById(id)
        .then(async user => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }
            user.role = role;
            await user.save();

            return res.json({ 
                success: true,
                message: 'Role berhasil diganti'
            });
        })
        .catch(err => { 
            return res.status(500).json({
                success: false,
                message: err.message
            })
        });

    } else {
        return res.status(400).json({
            success: false,
            message: 'Permintaan anda tidak bisa diproses.'
        })
    }
}

async function  requestResetPassword(req,res) {
    const { username, email } = req.body;
    if (username == null || email == null) return res.status(400).json({
        success: false,
        message: 'Username dan/atau email kosong'
    });

    User.findOne({ username, email })
    .then(async user => {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        await user.updateOne({ resetStatus: 'pending'});
        return res.status(200).json({
            success: true,
            message: 'Permintaan reset password diterima, silahkan tunggu. Periksa email secara berkala.'
        });
    })
    .catch(err => {
        return res.status(500).json({ 
            success: false,
            message: err.message
        });
    });
}

async function approveResetPassword(req,res) {
    const { approved } = req.query;
    const { userId } = req.params;
    const { username, email } = req.body;

    User.findById(userId)
    .then(async user => {
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        if (username == user.username && email == user.email) {
            if (approved == 'true') {
                const otp = crypto.randomInt(100000, 999999).toString();
                await user.updateOne({ 
                    resetStatus: 'approved', 
                    otp: otp, 
                    otpExpiry: new Date(Date.now() + 10 * 60 * 1000) 
                });
                const token = jwt.encode({ username: user.username, expire: Date.now() + tokenAge }, 'RESET-PASSWORD KEY');
                const link = `${vueUri}/reset-password?token=${token}`;
                await transporter.sendMail({
                    from: userMail.username,
                    to: user.email,
                    subject: 'Reset Your Password',
                    text: `Access this link to reset your password: ${link}\nYour OTP Code is: ${otp}`,
                    html: `
                      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                        <h2 style="color: #4CAF50;">Reset Your Password</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset your password. Click the button below to reset it:</p>
                        <a href="${link}" target="_blank" style="text-decoration: none;">
                          <button style="
                            display: inline-block;
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 20px;
                            font-size: 16px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-top: 10px;">
                            Reset Password
                          </button>
                        </a>
                        <p>Or, you can directly use this link:</p>
                        <p><a href="${link}" target="_blank" style="color: #4CAF50;">${link}</a></p>
                        <p>Your OTP Code is:</p>
                        <p style="font-size: 18px; font-weight: bold; color: #000;">${otp}</p>
                        <p>If you did not request a password reset, you can safely ignore this email.</p>
                        <br>
                        <p style="font-size: 12px; color: #888;">This is an automated email. Please do not reply to this email.</p>
                      </div>
                    `
                  })
                return res.json({ 
                    success: true,
                    message: 'Permintaan reset password disetujui, email telah dikirim'
                });
            } else {
                await user.updateOne({
                    resetStatus: 'no-request',
                    otp: null,
                    otpExpiry: null
                })
                return res.json({
                    success: false,
                    message: 'Permintaan resetp password dibatalkan'
                });
            }
            
        }
        return res.status(400).json({
            success: false,
            message: 'Username dan/email tidak cocok'
        });
    })
    .catch(err => {
        return res.status(500).json({ 
            success: false,
            message: err.message
        });
    });
}

async function resetPassword(req,res) {
    const { token } = req.query;
    const { otp, newPassword } = req.body;
    let username = null;
    try {
        username = jwt.decode(token, 'RESET-PASSWORD KEY').username;
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message});
    }
    User.findByUsername(username)
    .then(async user => {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        if (user.resetStatus == "no-request") {
            return res.status(400).json({
                success: false,
                message: 'User tidak sedang meminta perubahan password'
            });
        }
        const checkNewPassword = passwordValidation(newPassword);
        if (user.otp == otp) {
            if (checkNewPassword.error) {
                return res.status(400).json({
                    success: false,
                    message: checkNewPassword.message
                });
            } else {
                user.setPassword(newPassword)
                .then(() => {
                    user.resetStatus = 'no-request';
                    user.otp = null;
                    user.otpExpiry = null;
                    user.save();
                    return res.json({
                        success: true,
                        message:  'Password berhasil diganti'
                    }); 
                })
                .catch(err => { 
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                });
            }
        } else {
            return res.status(400).json({ 
                success: false,
                message: 'OTP tidak valid'
            });
        }
    })
    .catch(err => {
        return res.status(500).json({ 
            success: false,
            message: err.message
        });
    });
}

async function deleteAccount(req,res) {
    const { username, email } = req.body;
    const user = req.user;
    if (user.role == 'superadmin') {
        User.findOneAndDelete({ username: username, email: email })
        .then(user => {
            if (user) {
                return res.json({
                    success: true,
                    message: 'Akun berhasil dihapus.',
                    data: user
                })
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan. Akun gagal dihapus.'
            })
        })
    }
}

module.exports = { register, login, getToProfile, getAllAccounts, getAccount, updateAccount, requestResetPassword, approveResetPassword, resetPassword, deleteAccount };  
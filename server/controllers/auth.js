const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const nodemailer = require('nodemailer');
class AuthController {
  // API đăng ký
  async register(req, res) {
    try {
      const { email, password, name, avatar } = req.body;

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email này đã được đăng ký trên hệ thống",
        });
      }

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      // Tạo người dùng mới
      const user = new User({
        email,
        password: hashPassword,
        name,
        avatar,
      });
      await user.save();

      res.status(200).json({
        success: true,
        message: "Đăng ký tài khoản thành công",
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi trong quá trình đăng ký",
      });
    }
  }

  // API đăng nhập
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Tìm người dùng
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Email chưa được đăng ký trên hệ thống",
        });
      }

      // Kiểm tra mật khẩu
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Tài khoản hoặc mật khẩu không hợp lệ",
        });
      }

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi trong quá trình đăng nhập",
      });
    }
  }

  // API quên mật khẩu
  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
        // Tìm kiếm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email không tồn tại trong hệ thống',
            });
        }

        // Tạo JWT token để đặt lại mật khẩu
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'yourSecretKey',
            { expiresIn: '15m' } // Token hết hạn sau 15 phút
        );

        const resetLink = `http://localhost:3000/reset-password?key=${token}`;
        console.log('Reset Link:', resetLink);

        // Cấu hình Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Bạn có thể dùng dịch vụ khác nếu cần
            auth: {
                user: 'dunggs2020@gmail.com', // Email gửi
                pass: 'qfse sveu iymu hrsr',   // App Password (Google App Password)
            },
        });

        // Nội dung email
        const mailOptions = {
            from: 'dunggs2020@gmail.com', // Email gửi
            to: user.email,               // Email nhận
            subject: 'Đặt lại mật khẩu',
            html: `
                <p>Chào ${user.name},</p>
                <p>Nhấn vào liên kết dưới đây để đặt lại mật khẩu của bạn:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Liên kết này sẽ hết hạn sau 15 phút.</p>
            `,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Đã gửi email đặt lại mật khẩu',
        });
    } catch (error) {
        console.error('Lỗi quên mật khẩu:', error.message);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi trong quá trình gửi email',
        });
    }
}


  // API đặt lại mật khẩu
  async resetPassword(req, res) {
    const { key, newPassword } = req.body;

    try {
        // Giải mã token
        const decoded = jwt.verify(key, process.env.JWT_SECRET || 'yourSecretKey');

        // Tìm người dùng theo ID trong token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại',
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Đặt lại mật khẩu thành công',
        });
    } catch (error) {
        console.error('Lỗi đặt lại mật khẩu:', error.message);
        res.status(400).json({
            success: false,
            message: 'Liên kết không hợp lệ',
        });
    }
}
}

module.exports = new AuthController();

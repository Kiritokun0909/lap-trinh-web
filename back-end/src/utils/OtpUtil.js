const otpStore = {};
class OtpUtil {
  async generateOtp(length = 6) {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
  async saveOtp(email, otp, expriesIn = 5 * 60 * 1000) {
    otpStore[email] = { otp, expriesAt: Date.now() + expriesIn };
    setTimeout(() => {
      delete otpStore[email];
    }, expriesIn);
    console.log(otpStore);
  }
  async verifyOtp(email, otp) {
    const storedOtp = otpStore[email];
    if (!storedOtp) {
      return { success: false, message: 'OTP not found' };
    }
    if (storedOtp.otp !== otp) {
      return { success: false, message: 'OTP not matched' };
    }
    if (Date.now() > storedOtp.expriesAt) {
      return { success: false, message: 'OTP expired' };
    }
    return { success: true, message: 'OTP verified' };
  }
  async getOtp(email) {
    return otpStore[email];
  }
  async deleteOtp(email) {
    delete otpStore[email];
  }
}

module.exports = new OtpUtil();

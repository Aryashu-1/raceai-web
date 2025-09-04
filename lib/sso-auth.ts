export const sendEmailOTP = async (email: string) => {
  // Simulate sending OTP to email
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  localStorage.setItem(`otp_${email}`, otp)

  // In production, this would call your email service
  console.log(`OTP for ${email}: ${otp}`)

  return { success: true, message: "OTP sent to email" }
}

export const sendPhoneOTP = async (phone: string) => {
  // Simulate sending OTP to phone
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  localStorage.setItem(`otp_${phone}`, otp)

  // In production, this would call your SMS service
  console.log(`OTP for ${phone}: ${otp}`)

  return { success: true, message: "OTP sent to phone" }
}

export const verifyOTP = async (contact: string, otp: string) => {
  const storedOTP = localStorage.getItem(`otp_${contact}`)

  if (storedOTP === otp) {
    localStorage.removeItem(`otp_${contact}`)
    return { success: true, message: "OTP verified successfully" }
  }

  return { success: false, message: "Invalid OTP" }
}

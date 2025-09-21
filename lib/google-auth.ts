export const signInWithGoogle = async () => {
  return new Promise((resolve) => {
    // Simulate Google sign-in for demo purposes since FedCM is not available in v0
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          email: "demo@gmail.com",
          name: "Demo User",
          picture: "https://via.placeholder.com/40",
        },
      })
    }, 1000)
  })
}

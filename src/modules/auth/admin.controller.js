// Example Express Route
export const getAdminStats = async (req, res) => {
  try {
    const users = await User.find({}, 'name email createdAt'); // Fetch basic credentials
    const count = await User.countDocuments();
    
    res.status(200).json({
      totalAccounts: count,
      users: users
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin data" });
  }
};
import { UserAuth } from "../Context/AuthContext";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";

const Account = () => {
  const { user } = UserAuth();

  return (
    <div>
      {user ? (
        <div>
          <UserDashboard user={user} />
        </div>
      ) : (
        <div>
          <AdminDashboard />
        </div>
      )}
    </div>
  );
};

export default Account;

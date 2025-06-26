import { useEffect, useState } from "react";
import api from "../api/axios";

type UserProfile = {
  name: string;
  email: string;
  age: BigInteger;
  height: number;
  weight: number;
  gender: string;
};

function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    api
      .get("v1/user/me")
      .then((res) => setProfile(res.data))
      .catch(() => alert("Failed to load profile"));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {profile.name}</h2>
      <p>Email: {profile.email}</p>
      <p>Age: {profile.age}</p>
      <p>Height: {profile.height} cm</p>
      <p>Weight: {profile.weight} kg</p>
      <p>Gender: {profile.gender}</p>
    </div>
  );
}

export default DashboardPage;

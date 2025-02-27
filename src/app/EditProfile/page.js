"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import toast from "react-hot-toast";
import { updateUser } from "@/Services/Appwrite";

const EditProfile = () => {
  const router = useRouter();
  const { user, checkUserStatus } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (user?.userData) {
      setName(user.userData.name);
      setPhone(user.userData.phone);
    }
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      await updateUser(name);
      await checkUserStatus();
      toast.success("User Updated");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className=" md:max-w-[50%] mx-auto flex items-center justify-center ">
      <Card className="p-2 rounded-md flex-col flex gap-2 w-full ">
        <h3 className="font-semibold text-lg">Edit Profile</h3>
        <CardContent className="p-0">
          <form onSubmit={updateProfile} className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone No.</label>
              <Input
                className="disabled:bg-gray-200"
                value={parseInt(phone)}
                disabled={true}
                type="number"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;

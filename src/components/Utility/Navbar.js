"use client";

import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MapPin,
  Menu,
  Search,
  User,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";

const menuItems = [
  { title: "Birthday Decorations", href: "/birthday-decorations" },
];

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky bg-white top-0 z-50 w-full border-b ">
      <div className=" container flex gap-2 m-auto items-center p-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 border md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] px-2 sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            
            <nav className="mt-4 flex flex-col mx-5">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center ">
          <span className="text-base md:text-2xl font-bold text-primary">
            Pro
          </span>
        </Link>

        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-muted pl-8 md:w-2/3 lg:w-full"
            />
          </div>
        </div>

        <div className="ml-auto relative gap-2 flex items-center">
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => {
                user.isLogin
                  ? setIsDropdownOpen(!isDropdownOpen)
                  : router.push("/Auth");
              }}
              variant="ghost"
              size="icon"
              className="flex gap-2 w-full px-2"
            >
              <User className="" />
              <p className="md:flex hidden">Profile</p>
            </Button>
            {isDropdownOpen && (
              <UserDropdown setIsDropdownOpen={setIsDropdownOpen} />
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}

const UserDropdown = ({ setIsDropdownOpen }) => {
  const { logoutUser, user } = useAuth();
  const router = useRouter();
  return (
    <div className="absolute right-0 mt-3 min-w-52 bg-white border border-gray-200 shadow-md rounded-md p-2 z-50">
      <div className=" border-b">
        <div>
          Hello{" "}
          <span className="text-blue-500 font-semibold">
            {user?.userData?.name ? user?.userData?.name : "User"}
          </span>
        </div>
        <button
          onClick={() => {
            router.push("/EditProfile");
            setIsDropdownOpen(false);
          }}
          className="text-xs text-red-500 text-center w-full border border-red-200  my-2 p-1 rounded-md"
        >
          Complete your profile
        </button>
      </div>
      <Link
        href="/orders"
        className="flex items-center space-x-2 p-2 text-sm hover:bg-gray-100 rounded-md"
      >
        <Package className="h-4 w-4" />
        <span>Orders</span>
      </Link>
      <Link
        href="/settings"
        className="flex items-center space-x-2 p-2 text-sm hover:bg-gray-100 rounded-md"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>
      <button
        onClick={() => {
          logoutUser();
          setIsDropdownOpen(false);
        }}
        className="flex w-full items-center space-x-2 p-2 text-sm text-red-500 hover:bg-gray-100 rounded-md"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};

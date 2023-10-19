"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/navbar";
import { useGlobalContext } from "../globalContext/store";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Spinner from "./loading";
import Link from "next/link";
import Calendar from "react-calendar";
import Chatbox from "../components/chatbox/chatbox";
import { UserListTable } from "../components/chatbox/userlist-table";
import { DashboardUserLoginTable } from "../components/dashboard-userlogindetails/dashboard-userlogindetails";
import { webSocket } from "@/web-socket";
import io from "socket.io-client";

type TaskDashBoardObj = {
  taskid?: number;
  location?: string;
  clientname?: string;
  categoryid?: number;
  categoryname?: string;
};

// const webSocket = io("http://localhost:5000");
// const webSocket = io(process.env.DEVELOPMENT_SOCKET_URL);
export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const tmpUser = session?.user;
  const userRole = session?.user?.role;

  const [logginCount, setLogginCount] = useState(1);

  const [staffid, setStaffid] = useState<any>(tmpUser?.staffid);
  const [staffCount, setStaffCount] = useState("");
  const [projectCount, setProjectCount] = useState("");
  const [projectObject, setProjectbject] = useState<any[]>([]);

  // useEffect(() => {
  //   if (userRole != "User") {
  //   }
  // }, [userRole]);

  useEffect(() => {
    // if (window.performance && window.performance.getEntriesByType) {
    //   const navigationEntries =
    //     window.performance.getEntriesByType("navigation");
    //   if (navigationEntries.length > 0) {
    //     const navigationEntry: any = navigationEntries[0];
    //     if (navigationEntry.type === "navigate") {
    //       console.log("Page initially loaded");
    //     } else if (navigationEntry.type === "reload") {
    //       console.log("Page is being reloaded");
    //     }
    //   } else {
    //     console.log("PerformanceNavigationTiming data not available");
    //   }
    // } else {
    //   console.log(
    //     "PerformanceNavigationTiming is not supported in this browser"
    //   );
    // }
  }, []);

  useEffect(() => {
    webSocket.emit("join_room", "adminroom");
    webSocket.emit("logging", { message: "logged", room: "adminroom" });
  }, []);

  useEffect(() => {
    // socket.socket.on("chatMessage", callback);

    // webSocket.on(
    //   "receive_logging",
    //   function (data) {
    //     toggleWs1();
    //   }.bind(this)
    // );
    webSocket.on("receive_logging", function (data) {
      setLogginCount((prv) => prv + 1);
    });

    webSocket.on("receive_logout", (data) => {
      setLogginCount((prv) => prv + 1);
    });

    return () => {
      webSocket.off("receive_logging");
      webSocket.off("receive_logout");
    };
  }, []);

  const getStaffDetails = async () => {
    const fetchData = async () => {
      const response = await fetch("api/dashboard/get-staff-details");
      const res = await response.json();
      setStaffCount(res.totalStaffCount);
    };
    // call the function
    fetchData().catch(console.error);
  };

  // const toggleWs1 = () => {
  //   // setToggleWs((prv: boolean) => !prv);
  //   setToggleWs((prv: boolean) => {
  //     console.log("prv", prv);
  //     prv = !prv;
  //     console.log("!prv", prv);
  //     return prv;
  //   });
  // };

  const getProjectDetails = async () => {
    const fetchData = async () => {
      const response = await fetch("api/dashboard/get-project-details");
      const res = await response.json();
      setProjectCount(res.totalProjectCount);
    };
    // call the function
    fetchData().catch(console.error);
  };

  const getAssignedProjectDetails = async () => {
    const fetchData = async () => {
      const reponse = await fetch(
        "api/time-allocation/get-assign-projects?page-number=1&staffid=" +
          staffid
      );
      const res = await reponse.json();
      setProjectbject(res.project);
      //   setTotalProjectCount(res.totalAssignProjectCount);
    };
    // call the function
    if (staffid) {
      fetchData().catch(console.error);
    }
  };

  // const getUserList = async () => {
  //   const fetchData = async () => {
  //     const reponse = await fetch("api/staff/get-userdata");
  //     const res = await reponse.json();
  //     setUserList(res.users);
  //     //   setTotalProjectCount(res.totalAssignProjectCount);
  //   };

  //   fetchData().catch(console.error);
  // };

  useEffect(() => {
    getStaffDetails();
    getProjectDetails();
    // getUserList();
    // getAssignedProjectDetails();
  }, [staffid]);
  if (status === "loading") {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!session) {
    router.push("/"); // Redirect to login page if not authenticatedt
    return null;
  }
  return (
    <div className="bg-slate-200 flex flex-col w-full">
      <Navbar />
      {/* <Chatbox /> */}
      <div className="flex w-full">
        <div className="flex flex-col w-[70vw]">
          <h1 className="text-2xl m-4 text-blue-800 font-semibold">
            Elevate productivity today.
          </h1>

          <div className="flex flex-wrap pt-4 z-48">
            <div
              className={
                userRole == "Admin" || userRole == "Manager"
                  ? "mt-4 w-full lg:w-6/12 xl:w-6/12 px-5 mb-4 max-h-48 overflow-auto z-0"
                  : "hidden"
              }
            >
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
                <div className="flex-auto p-4">
                  <div className="flex flex-wrap">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h4 className="font-semibold text-blue-900 text-lg text-blueGray-700">
                        Staff Details
                      </h4>
                      <h4 className="font-semibold text-blue-700 text-base text-blueGray-700">
                        Staff Count - {staffCount}
                      </h4>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-green-500">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-blueGray-400 mt-4"></p>
                  <Link
                    href="/staff"
                    className="ml-auto flex justify-center w-1/4 bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-600 text-gray-100 p-2  rounded-lg tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>

            <div
              className={
                userRole == "Admin" || userRole == "Manager"
                  ? "mt-4 w-full lg:w-6/12 xl:w-6/12 px-5 mb-4 max-h-48 overflow-auto  z-48"
                  : "hidden"
              }
            >
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg ">
                <div className="flex-auto p-4">
                  <div className="flex flex-wrap">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h4 className="font-semibold text-blue-900 text-lg text-blueGray-700">
                        Project Details
                      </h4>
                      <h4 className="font-semibold text-blue-700 text-base text-blueGray-700">
                        Project Count - {projectCount}
                      </h4>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-blueGray-400 mt-4"></p>
                  <Link
                    href="/project"
                    className="ml-auto flex justify-center w-1/4 bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-600 text-gray-100 p-2  rounded-lg tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>

            <div
              className={
                userRole == "User" || userRole == "Manager"
                  ? "mt-4 w-full lg:w-6/12 xl:w-6/12 px-5 mb-4 max-h-48 overflow-auto  z-48"
                  : "hidden"
              }
            >
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
                <div className="flex-auto p-4">
                  <div className="flex flex-wrap">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h4 className="font-semibold text-blue-900 text-lg text-blueGray-700">
                        Project Details
                      </h4>
                      <div className="flex flex-col">
                        {projectObject?.map((p, index) => (
                          <div
                            key={p.projectid}
                            className="cursor-pointer border-blue-700 mt-1"
                          >
                            {/* <h5 className="font-semibold text-base text-blueGray-700">
                          {index + 1}. {p.projectname}
                        </h5> */}
                            <Link
                              href={
                                "/project/new-project?projectid=" + p.projectid
                              }
                              className="font-semibold text-base text-blueGray-700  hover:font-bold"
                            >
                              {index + 1}. {p.projectname}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-500">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-blueGray-400 mt-4"></p>
                  <Link
                    href="/time-allocation"
                    className="ml-auto flex justify-center w-1/4 bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-600 text-gray-100 p-2  rounded-lg tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[30vw] mr-3 ">
          {/* <button onClick={toggleWs1}>click </button> */}
          <DashboardUserLoginTable toggleWs={logginCount} />
        </div>
      </div>
    </div>
  );
}

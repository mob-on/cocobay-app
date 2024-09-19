import { useLoading } from "@src/shared/context/LoadingContext";
import { NextComponentType, NextPageContext } from "next";
import dynamic from "next/dynamic";

import LoadingScreen from "./LoadingScreen";

const BuildPage = dynamic(() => import("@src/pages/build"));
const BoostsPage = dynamic(() => import("@src/pages/home/boosts"));
const EarnPage = dynamic(() => import("@src/pages/earn"));
const FriendsPage = dynamic(() => import("@src/pages/friends"));

interface ILoadingScreenWrapperProps {
  children: React.ReactNode;
}

const LoadingScreenWrapper: React.FC<ILoadingScreenWrapperProps> = ({
  children,
}) => {
  const { allLoaded } = useLoading();

  return allLoaded ? (
    children
  ) : (
    <>
      <LoadingScreen />
      <div style={{ display: "none" }}>
        <BuildPage />
        <BoostsPage />
        <EarnPage />
        <FriendsPage />
      </div>
    </>
  );
};

export default LoadingScreenWrapper;

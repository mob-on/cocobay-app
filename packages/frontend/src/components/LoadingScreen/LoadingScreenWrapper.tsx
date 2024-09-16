import { useLoading } from "@src/shared/context/LoadingContext";
import { NextComponentType, NextPageContext } from "next";
import dynamic from "next/dynamic";

import LoadingScreen from "./LoadingScreen";

const BuildPage = dynamic(() => import("src/pages/build"));
const BoostsPage = dynamic(() => import("src/pages/home/boosts"));
const EarnPage = dynamic(() => import("src/pages/earn"));
const FriendsPage = dynamic(() => import("src/pages/friends"));

interface ILoadingScreenWrapperProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: any;
}

const LoadingScreenWrapper: React.FC<ILoadingScreenWrapperProps> = ({
  Component,
  pageProps,
}) => {
  const { allLoaded } = useLoading();

  return allLoaded ? (
    <Component {...pageProps} />
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

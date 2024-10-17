"use client";

import { useMainApi } from "@api/main/useMain.api";
import { type IFeatures, useStoredField } from "@contexts/LocalStorage";
import styles from "@src/styles/components/devSettings/devSettings.module.css";
import { Space } from "antd-mobile";
import Button from "antd-mobile/es/components/button";
import Input from "antd-mobile/es/components/input";
import Switch from "antd-mobile/es/components/switch";
import { CheckCircleOutline, CloseCircleOutline } from "antd-mobile-icons";
import { useCallback, useEffect, useState } from "react";

export const DevScreen = () => {
  const [mainApiBaseUrl, setMainApiBaseUrl] = useStoredField(
    "API_BASE_URL" as const,
  );
  const [features, setFeatures] = useStoredField("FEATURES" as const);
  const [mainApiVersion] = useState<string>("");
  const [mainApiDate] = useState<string>("");
  const [mainApiBaseUrlValue, setMainApiBaseUrlValue] = useState("");
  const api = useMainApi(mainApiBaseUrlValue);
  const [mainApiOk, setMainApiOk] = useState<boolean | null>(null);
  useEffect(() => {
    if (mainApiBaseUrl) setMainApiBaseUrlValue(mainApiBaseUrl);
  }, [mainApiBaseUrl]);

  useEffect(() => {
    testApi();
  }, []);

  const toggleFeature = useCallback(
    (feature: keyof IFeatures) => {
      setFeatures(
        (oldFeatures) =>
          ({
            ...oldFeatures,
            [feature]: !oldFeatures[feature],
          }) as IFeatures,
      );
    },
    [setFeatures],
  );

  const save = () => {
    setMainApiBaseUrl(mainApiBaseUrlValue);
  };

  const testApi = useCallback(() => {
    setMainApiOk(null);
    api
      .isHealthy()
      .then(setMainApiOk)
      .catch(() => setMainApiOk(false));
  }, [api]);

  return (
    <div className={styles.container}>
      <h1>Developer Settings</h1>
      <div className={styles.fields}>
        <div className={styles.field}>
          <div className={styles.label}>Front End App Version</div>
          <div className={styles.value}>
            {process.env.NEXT_PUBLIC_APP_VERSION ?? "edge"}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>Front End App Date</div>
          <div className={styles.value}>
            {process.env.NEXT_PUBLIC_APP_BUILD_TIME ?? "edge"}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>Back End App Version</div>
          <div className={styles.value}>{mainApiVersion}</div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>Back End App Date</div>
          <div className={styles.value}>{mainApiDate}</div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>Main API Base URL</div>
          <div className={styles.value}>
            <Input
              type="text"
              value={mainApiBaseUrlValue}
              onChange={setMainApiBaseUrlValue}
            />
            <Space align="center">
              <Button onClick={save}>Save</Button>
              <Button onClick={testApi}>Test</Button>
            </Space>
            {mainApiOk !== null &&
              (mainApiOk ? (
                <CheckCircleOutline
                  color="green"
                  className={styles.statusIcon}
                />
              ) : (
                <CloseCircleOutline color="red" className={styles.statusIcon} />
              ))}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>
            <Switch
              checked={features.tracking}
              onChange={() => toggleFeature("tracking")}
            />{" "}
            &nbsp; Tracking
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevScreen;

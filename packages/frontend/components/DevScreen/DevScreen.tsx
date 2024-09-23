"use client";

import { useMainApi } from "@api/main/useMainApi";
import { useStoredApiUrl } from "@src/shared/context/LocalStorageContext";
import styles from "@src/styles/components/devSettings/devSettings.module.css";
import Button from "antd-mobile/es/components/button";
import Input from "antd-mobile/es/components/input";
import { CheckCircleOutline, CloseCircleOutline } from "antd-mobile-icons";
import { useCallback, useEffect, useState } from "react";

export const DevScreen = () => {
  const [mainApiBaseUrl, setMainApiBaseUrl] = useStoredApiUrl();
  const [mainApiVersion, setMainApiVersion] = useState<string>("");
  const [mainApiDate, setMainApiDate] = useState<string>("");

  const [mainApiBaseUrlValue, setMainApiBaseUrlValue] = useState("");
  const api = useMainApi(mainApiBaseUrlValue);
  const [mainApiOk, setMainApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (mainApiBaseUrl) {
      setMainApiBaseUrlValue(mainApiBaseUrl);

      api
        .isHealthy()
        .then((res) => {
          setMainApiOk(!!res);
          setMainApiVersion(res.build.version);
          setMainApiDate(res.build.date ?? "edge");
        })
        .catch(() => setMainApiOk(false));
    }
  }, [mainApiBaseUrl]);

  const save = () => {
    setMainApiBaseUrl(mainApiBaseUrlValue);
  };

  const testApi = useCallback(() => {
    setMainApiOk(null);
    api
      .isHealthy()
      .then(setMainApiOk)
      .catch(() => setMainApiOk(false));
  }, [mainApiBaseUrlValue, api]);

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
            <Button onClick={testApi}>Test</Button>
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
      </div>
      <Button className={styles.save} onClick={save}>
        Save
      </Button>
    </div>
  );
};

export default DevScreen;

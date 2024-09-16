import { useMainApi } from "@src/shared/api/main/useMainApi";
import { useStoredApiUrl } from "@src/shared/context/LocalStorageContext";
import styles from "@src/styles/components/devSettings/devSettings.module.scss";
import { Button, Form, Input } from "antd-mobile";
import { CheckCircleOutline, CloseCircleOutline } from "antd-mobile-icons";
import { useCallback, useEffect, useState } from "react";

export const DevScreen = () => {
  const [mainApiBaseUrl, setMainApiBaseUrl] = useStoredApiUrl();
  const [mainApiVersion, setMainApiVersion] = useState<string>("");

  const [mainApiBaseUrlValue, setMainApiBaseUrlValue] = useState("");
  const api = useMainApi(mainApiBaseUrlValue);
  const [mainApiOk, setMainApiOk] = useState<boolean>(null);

  useEffect(() => {
    if (mainApiBaseUrl) {
      setMainApiBaseUrlValue(mainApiBaseUrl);

      api
        .isHealthy()
        .then((res) => {
          setMainApiOk(!!res);
          setMainApiVersion(res.version);
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
    <Form
      footer={<Button onClick={save}>Save</Button>}
      style={{ background: "#000", height: "100%" }}
    >
      <Form.Header>Developer Settings</Form.Header>
      <Form.Item label="Front End App Version">
        <div className={styles.longText}>
          {process.env.NEXT_PUBLIC_APP_VERSION ?? "edge"}
        </div>
      </Form.Item>
      <Form.Item label="Front End App Date">
        {process.env.NEXT_PUBLIC_APP_BUILD_TIME ?? "edge"}
      </Form.Item>
      <Form.Item label="Back End App Version">{mainApiVersion}</Form.Item>
      <Form.Item label="Main API Base URL" layout="horizontal">
        <Input
          type="text"
          value={mainApiBaseUrlValue}
          onChange={setMainApiBaseUrlValue}
        />
        <Button onClick={testApi}>Test</Button>
        {mainApiOk !== null &&
          (mainApiOk ? (
            <CheckCircleOutline color="green" className={styles.statusIcon} />
          ) : (
            <CloseCircleOutline color="red" className={styles.statusIcon} />
          ))}
      </Form.Item>
    </Form>
  );
};

export default DevScreen;

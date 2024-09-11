import { Button, Form, Input } from "antd-mobile";
import { CheckCircleOutline, CloseCircleOutline } from "antd-mobile-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMainApi } from "src/shared/api/main/useMainApi";
import { useStoredApiUrl } from "src/shared/context/LocalStorageContext";
import styles from "src/styles/pages/devSettings.module.scss";

export const DevScreen = () => {
  const [mainApiBaseUrl, setMainApiBaseUrl] = useStoredApiUrl();

  const [mainApiBaseUrlValue, setMainApiBaseUrlValue] = useState("");
  const api = useMainApi(mainApiBaseUrlValue);
  const [mainApiOk, setMainApiOk] = useState<boolean>(null);

  useEffect(() => {
    if (mainApiBaseUrl) {
      setMainApiBaseUrlValue(mainApiBaseUrl);
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

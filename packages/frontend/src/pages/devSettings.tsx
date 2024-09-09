import { Button, Form, Input } from "antd-mobile";
import { CheckCircleOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useMainApi } from "src/shared/api/main/useMainApi";
import { useLocalStorage } from "src/shared/hooks/useLocalStorage";
import { LocalStorage } from "src/shared/LocalStorage";

const DevScreen = () => {
  const [mainApiBaseUrl, setMainApiBaseUrl] = useLocalStorage<string>(
    LocalStorage.MAIN_API_BASE_URL,
  );

  const [mainApiBaseUrlValue, setMainApiBaseUrlValue] = useState("");
  //   const mainApi = useMainApi();
  const [mainApiOk, setMainApiOk] = useState<boolean>(null);

  useEffect(() => {
    if (mainApiBaseUrl) {
      setMainApiBaseUrlValue(mainApiBaseUrl);

      //   mainApi.isHealthy().then(setMainApiOk);
    }
  }, [mainApiBaseUrl]);

  const save = () => {
    setMainApiBaseUrl(mainApiBaseUrlValue);
  };

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
        <Button
          onClick={(e) => {
            setMainApiOk(null);
            setMainApiBaseUrl(mainApiBaseUrlValue);
          }}
        >
          Test
        </Button>
        {mainApiOk !== null && (
          <CheckCircleOutline
            style={{
              marginLeft: "1rem",
              color: mainApiOk ? "green" : "red",
            }}
          />
        )}
      </Form.Item>
    </Form>
  );
};

export default DevScreen;

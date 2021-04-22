import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import axios, { AxiosError } from 'axios';
import { Form, Input, Layout, Alert, Button, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

type FormValues = {
  link: string;
};

type ShortLinkRes = {
  short_link: string;
};

type ShortLinkErr = {
  error: string;
  error_desc: string;
};

export default function Home() {
  const [status, setStatus] = useState<'initial' | 'error' | 'success'>(
    'initial'
  );
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form] = Form.useForm();

  const onFinish = async ({ link }: FormValues) => {
    try {
      const response = await axios.post<ShortLinkRes>('/api/shorten_link', {
        link,
      });
      setStatus('success');
      setMessage(response.data?.short_link);
    } catch (e) {
      const error = e as AxiosError<ShortLinkErr>;
      setStatus('error');
      setMessage(error.response?.data?.error_desc || 'Something went wrong!');
    }
  };

  const onFinishedFailed = () => {
    setStatus('error');
    const error = form.getFieldError('link').join(' ');
    setMessage(error);
  };

  return (
    <Layout>
      <Head>
        <title>ShortLynk | Url Shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header className="header">
        <div className={styles.logo}>Shortlynk</div>
      </Header>
      <Content className={styles.content}>
        <div className={styles.shortener}>
          <Title level={5}>Copy &amp; Paste your lengthy link below</Title>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishedFailed}
          >
            <div className={styles.linkField}>
              <div className={styles.linkFieldInput}>
                <Form.Item
                  name="link"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: 'Please paste a valid link',
                      type: 'url',
                    },
                  ]}
                >
                  <Input placeholder="Paste here" size="large" />
                </Form.Item>
              </div>
              <div className={styles.linkFieldButton}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                    size="large"
                  >
                    Shorten
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          {['error', 'success'].includes(status) && (
            <Alert
              showIcon
              message={message}
              type={status as 'error' | 'success'}
            />
          )}
        </div>
      </Content>
      <Footer className={styles.footer}>
        ShortLynk &copy; {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

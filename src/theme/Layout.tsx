import React from 'react';
import Layout from '@theme-original/Layout';
import ChatBot from '@site/src/components/chatbot/ChatBot';

export default function LayoutWrapper(props: any): JSX.Element {
  return (
    <>
      <Layout {...props} />
      <ChatBot />
    </>
  );
}
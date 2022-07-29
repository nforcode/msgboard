import React, { useState, useEffect } from "react";
import styled from "styled-components";
const API =
  "https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc";
const Page = styled.div`
  width: 300px;
  height: 100%;
  background-color: black;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: white;
`;

const MessageForm = styled.form`
  margin-top: 20px;
`;

const MessageTextarea = styled.textarea`
  display: block;
  margin: 0 auto;
  resize: none;
  width: 280px;
`;
const SubmitButton = styled.button`
  display: block;
  margin: 10px auto;
`;
const MessageList = styled.div`
  margin-top: 20px;
`;
const MessageContainer = styled.div`
  display: block;
  border: 1px solid silver;
  color: gray;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  position: relative;
`;
const MessageHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const MessageAuthor = styled.div`
  color: gray;
`;
const MessageTime = styled.div`
  color: gray;
`;
const MessageBody = styled.div`
  display: block;
  color: white;
  margin-top: 8px;
  width: 220px;
  word-break: break-all;
`;
const Button = styled.button`
  color: silver;
  position: absolute;
  right: 5px;
  bottom: 5px;
  background-color: brown;
  border-radius: 5px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: red;
`;

const Author = styled.input`
  display: block;
  margin: 0 auto;
  margin-bottom: 5px;
  width: 278px;
`;

const Loading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 30px;
  align-items: center;
  color: white;
`;

function Message({ author, time, children, message, handleDelete }) {
  return (
    <MessageContainer>
      <MessageHead>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
      </MessageHead>
      <MessageBody>{children}</MessageBody>
      <Button
        onClick={() => {
          handleDelete(message.id);
        }}
      >
        刪除
      </Button>
    </MessageContainer>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [author, setAuthor] = useState("");
  const [textmsg, setTextmsg] = useState("");
  const [postMessageError, setPostMessageError] = useState(null);
  const [sendReqCtrl, setSendReqCtrl] = useState(false);

  const handleAuthorChange = (e) => {
    if (e.target.value.length <= 10) {
      return setAuthor(e.target.value);
    }
    // alert("超過字數囉");
  };
  const handleTextareaChange = (e) => {
    if (e.target.value.length <= 50) {
      return setTextmsg(e.target.value);
    }
    // alert("超過字數囉");
  };
  const fetchmsg = () => {
    return fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => {
        setApiError(err.message);
      });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (sendReqCtrl) {
      return;
    }
    setSendReqCtrl(true);
    fetch("https://student-json-api.lidemy.me/comments", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nickname: author,
        body: textmsg,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSendReqCtrl(false);
        if (data.ok === 0) {
          setPostMessageError(data.message);
          return;
        }
        setAuthor("");
        setTextmsg("");
        fetchmsg();
      })
      .catch((err) => {
        setSendReqCtrl(false);
        setPostMessageError(err.message);
      });
  };
  const handleDelete = (id) => {
    fetch("https://student-json-api.lidemy.me/comments/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setMessages(messages.filter((message) => message.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFocustoError = () => {
    setPostMessageError(null);
  };

  useEffect(() => {
    fetchmsg();
  }, []);
  return (
    <Page>
      {sendReqCtrl && <Loading>Loading Msg</Loading>}
      <Title>留言板</Title>
      <MessageForm onSubmit={handleFormSubmit}>
        <Author
          value={author}
          onChange={handleAuthorChange}
          onFocus={handleFocustoError}
          placeholder="請輸入名稱(10字內)"
        />
        <MessageTextarea
          value={textmsg}
          onChange={handleTextareaChange}
          onFocus={handleFocustoError}
          rows={10}
          placeholder="請輸入留言(50字內)"
        />
        <SubmitButton>送出</SubmitButton>
        {postMessageError && <ErrorMessage>{postMessageError}</ErrorMessage>}
      </MessageForm>
      <div
        style={{ display: "block", height: "1px", backgroundColor: "white" }}
      ></div>
      {apiError && (
        <ErrorMessage>somthing wrong.{apiError.toString()}</ErrorMessage>
      )}
      {messages.length === 0 && (
        <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
          No Message
        </div>
      )}
      <MessageList>
        {messages &&
          messages.map((message) => (
            <Message
              key={message.id}
              author={message.nickname}
              time={new Date(message.createdAt).toLocaleString()}
              handleDelete={handleDelete}
              message={message}
            >
              {message.body}
            </Message>
          ))}
      </MessageList>
      <div style={{ display: "block", height: "1px" }}></div>
    </Page>
  );
}

export default App;

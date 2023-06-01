import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState('')
  const [spinnerOn, setSpinnerOn] = useState(false)
  
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */navigate("/") }
  const redirectToArticles = () => { /* ✨ implement */navigate('/articles') }
  
  

  const logout = () => {
    // ✨ implement
    // If a token is in local storage, it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      setMessage('Goodbye!');
      redirectToLogin();
    } else {
      setMessage('Logout failed!');
    }
  };
  
  // Flush the message state, turn on the spinner,
    // and launch a request to the proper endpoint.
    // On success, set the token to localStorage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)

    axiosWithAuth()
      .post(loginUrl, { username, password })
      .then(res => {
        console.log(res);
        setMessage(res.data.message)
        localStorage.setItem('token', res.data.token)
        redirectToArticles();
        setSpinnerOn(false)
      })
      .catch(err => {
        console.log(err);
        setMessage(res.data.message)
      });
  
    
  };

    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!

    const getArticles = () => {
      setMessage("");
      setSpinnerOn(true);
    
      axiosWithAuth()
        .get(articlesUrl)
        .then(response => {
          console.log("getArticles Success", response);
          setArticles(response.data.articles);
          setMessage(response.data.message);
          setSpinnerOn(false);
        })
        .catch(error => {
          console.log("getArticles error", error);
          if (error.response && error.response.status === 401) {
            // Token expired, redirect to login
            setMessage("Token expired. Redirecting to login...");
            setSpinnerOn(false);
          } else {
            setMessage("An error occurred while fetching articles.");
            setSpinnerOn(false);
          }
        });
    };
    
  

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
   
    axiosWithAuth()
    .post(articlesUrl, article)
    .then(response => {
      console.log("postArticle Sucess", response);
      setMessage(response.data.message)
      setArticles(articles => {
        return articles.concat(response.data.article)})
    })
    .catch(error => {
      console.log('postArticles error', error);
      setMessage('An error occurred while posting the article.');
    });
  }


  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true);
    console.log(article, article_id)
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article) // Use PUT request to update the article
      .then(response => {
        console.log("updateArticle Success", response);
        setMessage(response.data.message);
        setArticles(articles => {
          return articles.map(art => {
            return art.article_id === article_id ? response.data.article : art
          })
        })
        setSpinnerOn(false);
      })
      .catch(error => {
        console.log("updateArticle error", error);
        setMessage(error.message);
        setSpinnerOn(false);
      });
  };
  

  const deleteArticle = article_id => {
    setSpinnerOn(true);

    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        console.log(res)
        setMessage(res.data.message);
        setArticles(articles => {
          return articles.filter(art => {
            return art.article_id != article_id
          })
        })
        setSpinnerOn(false);
      })
      .catch(error => {
        console.log("deleteArticle error", error);
        setMessage(error.message)
        setSpinnerOn(false);
      })
  };
  
  

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles" >Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              postArticle={postArticle} 
              setCurrentArticleId={setCurrentArticleId}
              currentArticle={currentArticleId}
              updateArticle={updateArticle}
              />
              <Articles 
                getArticles={getArticles} 
                articles={articles} 
                deleteArticle={deleteArticle} 
                updateArticle={updateArticle} 
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}

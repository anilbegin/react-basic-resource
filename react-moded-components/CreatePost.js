import React, {useState, useContext, useMemo} from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import Page from './Page'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

// Added React Markdown Toolbar
function CreatePost() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  // Optional: Configure the toolbar buttons
  const editorOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      placeholder: "Type your post content here...",
      toolbar : [
        "bold",
        "italic",
        "heading",
        "|",
        "unordered-list",
        "ordered-list",
        "|",
        "undo",
        "redo"
      ]
    }
  }, [])

  // Choice of tools that can be added to the "toolbar" Array - below.
  // "bold", "italic", "heading", "quote", "unordered-list", "ordered-list", "clean-block", 
  // "link", "image", "table", "horizontal-rule", "preview", "side-by-side", "fullscreen", "guide".

  async function handlePost(e) {
    e.preventDefault()
    try {
      const response = await Axios.post('/create-post', {
        title: title,
        body : body, 
        token: appState.user.token
      })
      console.log(response)
      if(response.data) {
        console.log(response.data)
        appDispatch({type: 'flashMessage', value: 'Congrats, New Post Created!'})
        navigate(`/post/${response.data}`)
      } else {
        console.log('There was a problem')
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Page title='Create New Post'>
      <div className="container container--narrow py-md-5">
        <form onSubmit={handlePost}>
          <div className="form-group">
            <label htmlFor="post-title" className="text-muted mb-1">
              <small>Title</small>
            </label>
            <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          </div>

          <div className="form-group">
            <label htmlFor="post-body" className="text-muted mb-1 d-block">
              <small>Body Content</small>
            </label>
            <SimpleMDE value={body} onChange={value => setBody(value)} options={editorOptions} />
          </div>

          <button className="btn btn-primary">Save New Post</button>
        </form>
      </div>
    </Page>
  )
}

export default CreatePost
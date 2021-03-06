import React from 'react';
import { connect } from 'react-redux';

import './styles.css';
import * as selectors from '../../reducers';
import * as actions from '../../actions/posts';


const PostRow = ({ 
    post, 
    state,
}) => {
  const user = selectors.getUser(state, post.user)
  return(
    <div className="posts">
      <div className="postUser">
          <div>{user.username}</div>
      </div>
      <div className="postCotent">
          <div>{ post.content }</div>
      </div>
    </div>
  )
};

export default connect(
  (state, {id}) => ({
    post: selectors.getPost(state, id),
    state: state
  }),
  (dispatch, { id }) => ({
    onDelete() {
      dispatch(actions.startRemovingPost(id));
    }
  }),
)(PostRow);
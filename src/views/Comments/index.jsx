import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, Avatar, List, ListItem, ListItemText, Box
} from '@mui/material';
import { toast } from 'react-toastify';
import { getApi, postApi, updateApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';

const CommentDialog = ({ open, onClose, complaintId, user = {} }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    if (!complaintId) return;
    try {
      setLoading(true);
      const res = await getApi(`${urls.Comments.getComments}/${complaintId}`);
      console.log(res.data);
      setComments(res.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user._id) return;
    try {
      setLoading(true);
      await postApi(`${urls.Comments.Create}?complaintId=${complaintId}`, {
        senderId: user._id,
        senderRole: user.role || 'tenant',
        message: newComment
      });
      setNewComment('');
      fetchComments();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (message) => {
    if (!complaintId || !user._id) return;
    try {
      await updateApi(`${urls.Comments.markAsRead}?complaintId=${complaintId}&userId=${user._id}&role=${user.role}`);
    } catch (error) {
      console.error('Error marking comments as read:', error);
    }
  };

  useEffect(() => {
    if (open && complaintId) {
      fetchComments();
      handleMarkAsRead();
    }
  }, [open, complaintId, user._id]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const renderSenderName = (comment) => {
    if (!comment?.senderId) return 'Unknown';
    if (typeof comment.senderId === 'string') {
      return comment.senderId === user._id ? 'You' : `${comment.senderRole}`;
    }
    if (comment.senderId._id === user._id) return 'You';
    return comment.senderId.name || comment.senderRole;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Comments</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {loading && comments.length === 0 ? (
          <Typography>Loading comments...</Typography>
        ) : comments.length === 0 ? (
          <Typography color="textSecondary">No comments yet</Typography>
        ) : (
          <List dense>
            {comments.map((comment) => {
              const isMine = comment?.senderId?._id === user._id || comment?.senderId === user._id;
              const isUnread = !comment.isRead && !isMine;

              return (
                <ListItem key={comment._id} alignItems="flex-start">
                  <Avatar sx={{ mr: 2 }}>
                    {(comment.senderId?.name || comment.senderRole || '?')[0].toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography component="span" variant="subtitle2" color="primary">
                          {renderSenderName(comment)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({comment.senderRole})
                        </Typography>
                        {isUnread && (
                          <Typography variant="caption" color="error">
                            • New
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textPrimary">
                          {comment.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                        {user?.role === 'companyAdmin' && comment.readBy?.length > 0 && (
                          <Typography variant="caption" color="success.main" display="block" mt={0.5}>
                            Seen by:{' '}
                            {Array.from(
                              new Set(
                                comment.readBy
                                  .filter(r => r.role !== 'companyAdmin') // exclude companyAdmin from seen list
                                  .map(r => r.role)
                              )
                            ).join(', ') || 'No one yet'}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 3, py: 2 }}>
        <TextField
          label="Write a comment..."
          multiline
          rows={2}
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <Button
          onClick={handleAddComment}
          variant="contained"
          fullWidth
          disabled={loading || !newComment.trim()}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;

// FeedbackForm.jsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { submitFeedback } from '../../services/feedbackService';
import Button from '../ui/Button';

export const FeedbackForm = ({ order, token, onFeedbackSubmitted }) => {
  const [rating, setRating]           = useState(5);
  const [comment, setComment]         = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await submitFeedback(
        { order_id: order.id, rating, comment: comment.trim() },
        token
      );
      onFeedbackSubmitted?.(response.feedback);
    } catch (err) {
      console.error('Feedback submission failed:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
          Rate your Experience
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 rounded-full transition-transform hover:scale-125 focus:outline-none cursor-pointer"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  value <= (hoveredRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-700'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment textarea */}
      <div>
        <label
          htmlFor={`comment-${order.id}`}
          className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2"
        >
          Comment (optional)
        </label>
        <textarea
          id={`comment-${order.id}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Share your experience (food taste, portion, service)..."
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-950/30 focus:border-orange-500 transition-all"
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <Button type="submit" disabled={submitting} size="sm">
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
        {error && (
          <span className="text-xs font-bold text-red-400">{error}</span>
        )}
      </div>
    </form>
  );
};

export default FeedbackForm;

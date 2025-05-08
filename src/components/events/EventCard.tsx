import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    datetime: string;
    category: string;
  };
  onDelete?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDelete }) => {
  const { isAuthenticated } = useAuth();
  
  // Get category color based on event category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cultural':
        return 'bg-purple-100 text-purple-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format event date and time
  const eventDate = new Date(event.datetime);
  const formattedDate = format(eventDate, 'MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  return (
    <div className="card group hover:scale-[1.01] transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          {isAuthenticated && onDelete && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                onDelete(event.id);
              }}
              className="text-gray-400 hover:text-error-600 transition-colors"
              aria-label={`Delete ${event.name}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
        <h3 className="mt-3 text-xl font-semibold text-gray-900 line-clamp-1">{event.name}</h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
          <Clock className="h-4 w-4 ml-3 mr-1" />
          <span>{formattedTime}</span>
        </div>
        <div className="mt-4">
          <Link
            to={`/events/${event.id}`}
            className="btn-primary w-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
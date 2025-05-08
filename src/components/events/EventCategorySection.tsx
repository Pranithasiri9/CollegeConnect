import React from 'react';
import EventCard from './EventCard';

interface Event {
  id: string;
  name: string;
  description: string;
  datetime: string;
  category: string;
}

interface EventCategorySectionProps {
  title: string;
  events: Event[];
  onDeleteEvent?: (id: string) => void;
}

const EventCategorySection: React.FC<EventCategorySectionProps> = ({
  title,
  events,
  onDeleteEvent,
}) => {
  if (events.length === 0) {
    return null;
  }

  // Create an ID from the title for anchor navigation
  const sectionId = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section id={sectionId} className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onDelete={onDeleteEvent}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCategorySection;
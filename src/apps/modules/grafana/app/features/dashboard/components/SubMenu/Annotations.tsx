import { useEffect, useState } from 'react';

import { AnnotationQuery, DataQuery, EventBus } from '@data/index';

import { AnnotationPicker } from './AnnotationPicker';

interface Props {
  events: EventBus;
  annotations: AnnotationQuery[];
  onAnnotationChanged: (annotation: AnnotationQuery<DataQuery>) => void;
}

export const Annotations = ({ annotations, onAnnotationChanged, events }: Props) => {
  const [visibleAnnotations, setVisibleAnnotations] = useState<AnnotationQuery[]>([]);
  useEffect(() => {
    setVisibleAnnotations(annotations.filter((annotation) => annotation.hide !== true));
  }, [annotations]);

  if (visibleAnnotations.length === 0) {
    return null;
  }

  return (
    <div>
      {visibleAnnotations.map((annotation) => (
        <AnnotationPicker
          events={events}
          annotation={annotation}
          onEnabledChanged={onAnnotationChanged}
          key={annotation.name}
        />
      ))}
    </div>
  );
};

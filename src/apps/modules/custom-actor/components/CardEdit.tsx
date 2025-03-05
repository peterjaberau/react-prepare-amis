import React from 'react';
import { useSelector } from '@xstate/react';
import { AnyActorRef } from "xstate";
import { Save, X } from 'lucide-react';

type CardEditProps = {
  actor: AnyActorRef;
};

export function CardEdit({ actor }: CardEditProps) {
  const editData = useSelector(actor, (state) => state.context.editData);
  const currentState = useSelector(actor, (state) => state.value);

  if (!editData) return null;

  const handleFieldChange = (field: 'title' | 'content', value: string) => {
    actor.send({ type: 'UPDATE_FIELD', field, value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <input
          className="text-lg font-semibold w-full mr-2 px-2 py-1 border rounded"
          value={editData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => actor.send({ type: 'SAVE' })}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Save size={18} />
          </button>
          <button
            onClick={() => actor.send({ type: 'CANCEL' })}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <textarea
        className="w-full px-2 py-1 border rounded"
        value={editData.content}
        onChange={(e) => handleFieldChange('content', e.target.value)}
        rows={3}
      />
      <div className="mt-4 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>State: {currentState as string}</span>
          <span>Actor ID: {actor.id}</span>
        </div>
      </div>
    </div>
  );
}

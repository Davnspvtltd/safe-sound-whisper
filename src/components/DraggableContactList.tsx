import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import ContactCard from "./ContactCard";
import { Contact } from "@/hooks/useContacts";

interface AlertStatus {
  calling: boolean;
  called: boolean;
  messaging: boolean;
  messageSent: boolean;
}

interface DraggableContactListProps {
  contacts: Contact[];
  onReorder: (newOrder: Contact[]) => void;
  onDelete: (id: string) => void;
  isAlerting: boolean;
  alertStatuses: Record<string, AlertStatus>;
}

const DraggableContactList = ({
  contacts,
  onReorder,
  onDelete,
  isAlerting,
  alertStatuses,
}: DraggableContactListProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || isAlerting) return;

    const items = Array.from(contacts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update priorities based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index,
    }));

    onReorder(updatedItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="contacts">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-3 ${snapshot.isDraggingOver ? "bg-primary/5 rounded-xl p-2 -m-2" : ""}`}
          >
            {contacts.map((contact, index) => (
              <Draggable 
                key={contact.id} 
                draggableId={contact.id} 
                index={index}
                isDragDisabled={isAlerting}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`relative ${snapshot.isDragging ? "z-50" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      {!isAlerting && (
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-secondary cursor-grab active:cursor-grabbing transition-colors"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <ContactCard
                          contact={contact}
                          onDelete={onDelete}
                          isPrimary={index === 0}
                          alertStatus={isAlerting ? alertStatuses[contact.id] : undefined}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableContactList;

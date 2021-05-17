const compareEventPrice = (prevEvent, nextEvent) => nextEvent.eventTotal - prevEvent.eventTotal;

const sortEventDown = (prevEvent, nextEvent) => (nextEvent.eventEndTime - nextEvent.eventStartTime) - (prevEvent.eventEndTime - prevEvent.eventStartTime);

const sortEventDay = (prevEvent, nextEvent) => prevEvent.eventStartTime - nextEvent.eventStartTime;

export {sortEventDown, compareEventPrice, sortEventDay};

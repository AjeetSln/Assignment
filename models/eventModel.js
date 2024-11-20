const { ObjectId } = require('mongodb');


class Event {
  constructor(
    type,
    uid,
    name,
    tagline,
    schedule,
    description,
    files,
    moderator,
    category,
    sub_category,
    rigor_rank,
    attendees = []
  ) {
    this.type = type;
    this.uid = uid;
    this.name = name;
    this.tagline = tagline;
    this.schedule = schedule;
    this.description = description;
    this.files = files;
    this.moderator = moderator;
    this.category = category;
    this.sub_category = sub_category;
    this.rigor_rank = rigor_rank;
    this.attendees = attendees;
  }
}

module.exports = Event;

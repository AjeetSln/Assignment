const { ObjectId } = require('mongodb');

class Nudge {
  constructor({
    eventTag,
    title,
    image = null,
    scheduleDate,
    scheduleTime,
    description,
    icon,
    invitationMessage,
    createdAt = new Date(),
  }) {
    this.eventTag = eventTag;
    this.title = title;
    this.image = image;
    this.scheduleDate = scheduleDate;
    this.scheduleTime = scheduleTime;
    this.description = description;
    this.icon = icon;
    this.invitationMessage = invitationMessage;
    this.createdAt = createdAt;
  }

  // Static method to validate the Nudge structure
  static validate(data) {
    const errors = [];

    if (!data.eventTag || typeof data.eventTag !== 'string') {
      errors.push('Event tag is required and must be a string.');
    }
    if (!data.title || typeof data.title !== 'string') {
      errors.push('Title is required and must be a string.');
    }
    if (!data.scheduleDate || typeof data.scheduleDate !== 'string') {
      errors.push('Schedule date is required and must be a string.');
    }
    if (!data.scheduleTime || typeof data.scheduleTime !== 'string') {
      errors.push('Schedule time is required and must be a string.');
    }
    if (!data.description || typeof data.description !== 'string') {
      errors.push('Description is required and must be a string.');
    }

    return errors.length ? errors : null;
  }

  // Static method to convert database record into a Nudge instance
  static fromDB(data) {
    return new Nudge({
      ...data,
      _id: data._id ? new ObjectId(data._id) : undefined,
    });
  }
}

module.exports = Nudge;

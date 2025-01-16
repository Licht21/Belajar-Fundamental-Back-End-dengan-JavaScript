/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;
    await this._notesService.verifyNoteOwner(noteId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId);
    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;
    await this._notesService.verifyNoteOwner(noteId, credentialId);
    await this._collaborationsService.deleteCollaboration(noteId, userId);
    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    }).code(200);
  }
}

module.exports = CollaborationsHandler;

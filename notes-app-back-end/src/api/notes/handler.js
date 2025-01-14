/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const { title = 'untitled', body, tags } = request.payload;

    const noteId = await this._service.addNote({ title, body, tags });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler() {
    const notes = await this._service.getNotes();
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params;

    const note = await this._service.getNoteById(id);

    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  async putNoteByIdHandler(request, h) {
    await this._validator.validateNotePayload(request.payload);
    const { id } = request.params;

    this._service.editNoteById(id, request.payload);
    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteNoteById(id);
    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = NotesHandler;

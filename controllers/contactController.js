const asyncHandler = require('express-async-handler');
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
    console.log("GET: /api/contacts/");
    const contacts = await Contact.find({ user_id: req.user.id });
    // const contacts = await Contact.find();
    res.status(200).json(contacts);
    console.log(`   ${res.statusCode}: Contacts fetched for "${req.user.username}"\n`);
});

const createContact = asyncHandler(async (req, res) => {
    console.log(`POST: /api/contacts/`);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory...");
    }
    const contact = await Contact.create({ user_id: req.user.id, name, email, phone });
    res.status(201).json(contact);
    console.log(`   ${res.statusCode}: Contact created successfully.\n`);

});

const getContact = asyncHandler(async (req, res) => {
    console.log(`GET: /api/contacts/${req.params.id}`);
    if (req.params.id.length != 24) {
        res.status(400);
        console.log(`   ${res.statusCode}: Id should be of 24 characters.\n`);
        throw new Error("Id should be of 24 characters.");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        console.log(`   ${res.statusCode}: Contact not found.\n`);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        console.log(`   ${res.statusCode}: Unauthorized Access!!!\n`);
        console.log(`contact userid: ${contact.user_id.toString()}\nuserid of current user: ${req.user.id}`);
        throw new Error("User does not have permission to access this record.");
    }

    res.status(200).json(contact);
    console.log(`   ${res.statusCode}: Found id for ${req.params.id}.\n`);

});

const UpdateContact = asyncHandler(async (req, res) => {
    console.log(`PUT: /api/contacts/${req.params.id}`);
    if (req.params.id.length != 24) {
        res.status(400);
        console.log(`   ${res.statusCode}: Id should be of 24 characters.\n`);
        throw new Error("Id should be of 24 characters.");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        console.log(`   ${res.statusCode}: Contact not found.\n`);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        console.log(`   ${res.statusCode}: Unauthorized Access!!!\n`);
        console.log(`contact userid: ${contact.user_id.toString()}\nuserid of current user: ${req.user.id}`);
        throw new Error("User does not have permission to update this record.");
    }
    const newContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.status(200).json(newContact);
    console.log(`   ${res.statusCode}: ${contact.id} Contact updated successfully.\n`);

});

const deleteContact = asyncHandler(async (req, res) => {
    console.log(`DELETE: /api/contacts/${req.params.id}`);
    if (req.params.id.length != 24) {
        res.status(400);
        console.log(`   ${res.statusCode}: Id should be of 24 characters.\n`);
        throw new Error("Id should be of 24 characters.");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        console.log(`   ${res.statusCode}: Contact not found.\n`);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        console.log(`   ${res.statusCode}: Unauthorized Access!!!\n`);
        console.log(`contact userid: ${contact.user_id.toString()}\nuserid of current user: ${req.user.id}\n`);
        throw new Error("User does not have permission to delete this record.");
    }
    // await Contact.remove;
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
    console.log(`   ${res.statusCode}: Contact deleted successfully.\n`);

});

module.exports = { getContacts, createContact, getContact, UpdateContact, deleteContact };
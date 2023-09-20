const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT;


// Error Response function
const errorResponse = (res, error) => {
    return(
        res.status(500).json({
            error: error.message
        })
    )
}


//SIGNUP
router.post('/signup', async (req, res) => {

    try {

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 13),
            locationZip: req.body.locationZip,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            bioTagline: req.body.bioTagline,
            bioParagraph: req.body.bioParagraph,
            userImage: req.body.userImage
        });

        const newUser = await user.save();
        const token = jwt.sign({id: newUser._id}, SECRET, {expiresIn: "1 day"});  // from Jake's notes

        res.status(200).json({
            user: newUser,
            message: 'Success!',
            token
        })


    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});

//LOGIN

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({email: email});
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!user || !passwordMatch) throw new Error('Email or Password does not match');
        const token = jwt.sign({id: user._id}, SECRET, {expiresIn: "1 day"});

        res.status(200).json({
            message: `Success!`,
            user,
            token
        })

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
})


//TODO PATCH One - Make Updates
// *** ValidateSession was removed from this endpoint***

router.patch('/:id/edit', async (req, res) => {
    try {
        
        //1. Pull value from parameter
        const { id } = req.params;

        const filter = {_id: id}

        //2. Pull data from the body
        const info = req.body;
        

        //3. Use method to locate document based off ID and pass in new info.
        const returnOption = {new: true};

       
        const updated = await User.findOneAndUpdate(filter, info, returnOption);
        if(!updated) throw new Error('no.')
        
        //4. Respond to client.
        res.status(200).json({
            message: `Your profile has been updated!`,
    
            updated
        })
        
    } catch (err) {
        errorResponse(res, err)
    }
})

module.exports = router;


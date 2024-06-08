import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';

// Routes
router.get('/', async (req, res) => {
    try {
        const locals = {
            title: 'NodeJS Blog',
            description: 'Simple blog with node, mongo and express'
        }
        let pageLimit = 2;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(pageLimit * page - pageLimit)
            .limit(pageLimit)
            .exec();
        const count = await Post.countDocuments();
        const nextPage = Number(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / pageLimit);
        // const data = await Post.find();
        res.render('index', { locals, data, current: page, nextPage: hasNextPage ? nextPage : null });
    }
    catch (error) { console.error(error); }
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/post/:id', async (req, res) => {
    try {
        const locals = {
            title: 'NodeJS Blog',
            description: 'Simple blog with node, mongo and express'
        }
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        res.render('post', { locals, data })

    }
    catch (error) { console.error(error) }
});

router.post('/search', async (req, res) => {
    const locals = {
        title: 'NodeJS Blog',
        description: 'Simple blog with node, mongo and express'
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    try {
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]

        });
        res.render('search', { data, locals });
    }
    catch (error) { console.error(error); }
});
// function insertPostData() {
//     Post.insertMany([
//         {
//             title: 'Building a Blog',
//             body: 'Lorem ipsum lorem ipsum'
//         },
//         {
//             title: 'Building a Blog',
//             body: 'Lorem ipsum lorem ipsum'
//         },
//         {
//             title: 'Building a Blog',
//             body: 'Lorem ipsum lorem ipsum'
//         }
//     ]);
// }
// insertPostData();

export default router;
const express = require('express');
const mongoose = require( 'mongoose' );
const ejs = require( 'ejs' );
const { response } = require( 'express' );


const app = express();

app.set( 'view engine', 'ejs' );
app.use( express.static( 'public' ) );
app.use( express.urlencoded( { extended: true } ) );

mongoose.connect( 'mongodb://localhost27017/wikiDB' );

const articlesSchema = new mongoose.Schema( {
	title: String,
	content: String
} );

const Article = mongoose.model( 'article', articlesSchema );

app.get( '/', ( req, res ) => {
	Article.find( {}, ( err, response ) => {
		if ( !err ) {
			res.send( response );
		}
	})
})

app.listen( 3000, () => console.log( 'Server is running on port 3000' ) );
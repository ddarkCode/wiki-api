const express = require('express');
const mongoose = require( 'mongoose' );
const ejs = require( 'ejs' );
const { response } = require( 'express' );


const app = express();

app.set( 'view engine', 'ejs' );
app.use( express.static( 'public' ) );
app.use( express.urlencoded( { extended: true } ) );

mongoose.connect( 'mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true} );

const articlesSchema = new mongoose.Schema( {
	title: String,
	content: String
} );

const Article = mongoose.model( 'article', articlesSchema );


app.route('/articles')
.get((req, res) => {
	Article.findOne({title: req.params.title}, (err, foundArticles) => {
		if ( !err ){
			res.send( foundArticles );
		} else {
			console.log( err );
		}
	})
} )
.post(  ( req, res ) => {
	console.log( req.body );
	const { title, content } = req.body;
	const newArticle = new Article( {
		title: title,
		content: content
	} );
	
	newArticle.save( ( err, result ) => {
		if ( !err ) {
			res.send( result );
		}
	} );
} )

.delete( ( req, res ) => {
		Article.deleteMany( {}, ( err ) => {
			if ( !err ) {
				res.send( 'Successfully deleted all articles' );
			}
		} );
	} );




app.route( '/articles/:title' )
	.get( ( req, res ) => {
		const { title } = req.params;
		Article.find( { title: title }, ( err, foundArticle ) => {
			if ( !err ) {
				console.log( foundArticle );
				res.send( foundArticle );
			} else {
				res.send( err );
			}
		} );
	} )
	.put( ( req, res ) => {
		const { title } = req.params;
		Article.update( { title: title }, { title: req.body.title, content: req.body.content }, { overwrite: true }, ( err, raw ) => {
			if ( !err ) {
				console.log( 'Successfully updated the article' );
				res.send( raw );
			}
		} );
	} )
	.patch( ( req, res ) => {
		const { title } = req.params;
		Article.update( { title: title }, req.body, ( err, raw ) => {
			if ( !err ) {
				console.log( raw );
				res.send( 'Successfully updated the article' );
			}
		} );
	} )
	.delete( ( req, res ) => {
		Article.deleteOne( { title: req.params.title }, ( err ) => {
			if ( !err ) {
				res.send( 'Successfully deleted the selected article.' );
			}
		} );
	} );



app.listen( 3000, () => console.log( 'Server is running on port 3000' ) );
import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage", async (req:express.Request, res:express.Response) => {
    //get image_url query
    const {image_url} = req.query

    const validateImageQuery = async (imageUrl:string) => { //from https://stackoverflow.com/questions/30970068/js-regex-url-validation/30970319 (best answer)
      var res = imageUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      if(res == null)
          return false;
      else
          return true;
    }


    //this code snippet is referenced from Victor A's comment in this thread https://knowledge.udacity.com/questions/166155
    let isValid = await validateImageQuery(image_url);
    if(!isValid) {
      return res.status(400).send('invalid image url!');
    }

    try {
       //get filteredpath by using filterImagefromURL function
       if (image_url){
        const filteredpath = await filterImageFromURL(image_url)
        //send filtered image in response
        res.status(200).sendFile(filteredpath)

        //delete file from filesystem
        await deleteLocalFiles([image_url])
       }else{
        res.status(422);       
        throw new Error("There was an error! Please try again.");  
       }
    
    } catch (err) {
      res.status(422);             
      throw new Error("There was an error! Please try again.");   
    }
   
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req:express.Request, res:express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
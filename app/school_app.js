const express= require('express');
const app= express();
const {sqlmap, multer, randomBytes, createHmac, path, fs}= require('../server');
const { json } = require('body-parser');
const sharp= require("sharp")

const multer_location= multer.diskStorage({
    destination: (req, file, cb)=>{
     cb(null, "./public/image/default/")
    } ,
  
    filename: (req, file, cb)=>{
  
      cb(null, new Date().getTime()+"_"+file.originalname)
    },
    
  })
  
  
  
module.exports= {
    multer_upload_school_settings: multer({
        storage: multer_location,
      
        limits: {fileSize: 1024*1024*2},
        fileFilter: (req, file, cb)=>{
          if(file.mimetype=="image/png" || file.mimetype=="image/jpeg")
          {
            cb(null, true)
          } 
          else 
          {
              cb(new Error("file extension allow only png or jpeg"))
          }
          
        }
      
      }),


   admin_class_section_get: (req, res)=>{
    
        sqlmap.query(`SELECT * FROM class_section ORDER BY ID`, (err, info)=>{
            if(err) console.log(err.sqlMessage);
            
            var element= 
            `<div class="col-11 m-auto">
              <table class=" table table-bordered">
                <thead>
                  <tr>
                    <th>CLASS</th>
                    <th>SECTION</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
              
                <tbody>
              
                    
          
              `

            for (let index = 0; index < info.length; index++) {
                element+=`
                
                <tr>
                <td><li class="list-group-item p-2 list-group-item-success fw-bold">${info[index].class}</li></td>
                <td><li class="list-group-item p-2 list-group-item-success fw-bold">${info[index].section}</li></td>
                <td>
                  <button data-status="${info[index].at_status}" data-id="${info[index].ID}" class="btn fw-bold ${info[index].at_status=='on'?'btn-success':'btn-danger'} pushed">${info[index].at_status}</button>
                </td>
              </tr> 

                `
                
            }

            element+=`
            </tbody>
            </table>
          </div>`
          
            res.send({element})
        })

     
    
    },    

    admin_class_section_post: (req, res)=>{
        const {elementid, at_status}= req.body;
        sqlmap.query( `UPDATE class_section SET at_status='${at_status}' WHERE ID=${elementid}`, (err, next)=>{
            if(err) console.log(err.sqlMessage);
            else res.send({msg: 'updated...'})
        })

    },

    admin_school_page: (req, res)=>{

        sqlmap.query(`SELECT * FROM school_settings ORDER BY ID DESC LIMIT 1`, (err, info)=>{
            if(err) console.log(err.sqlMessage);
            else res.render('admin/school_page', {info})
        })

        

    },

    admin_school_post:  (req, res)=>{
    const {EIIN, name, about}= req.body;
        sqlmap.query(`SELECT * FROM school_settings ORDER BY ID DESC LIMIT 1`, (errHave, infoHave)=>{
            if(errHave) console.log(errHave.sqlMessage);
            if(infoHave.length==0||infoHave==undefined){

                sqlmap.query(`INSERT INTO school_settings (EIIN, name, about)VALUES( '${EIIN}', '${name}','${about}')`, (err, next)=>{
                    if(err) console.log(err.sqlMessage);
                    else res.send({msg: 'Updated'})
        
                })
        

            } else {
                sqlmap.query(`UPDATE school_settings SET EIIN='${EIIN}', name='${name}', about="${about}"`, (err, next)=>{
                    if(err) console.log(err.sqlMessage);
                    else res.send({msg: ' Updated'})
                })
            }
            
        })
        

    },  
    
    admin_school_person_post:  (req, res)=>{
            const {h_name, h_msg, p_name, p_msg, s_name, s_msg}= req.body;
                sqlmap.query(`SELECT * FROM school_settings ORDER BY ID DESC LIMIT 1`, (errHave, infoHave)=>{
                    if(errHave) console.log(errHave.sqlMessage);
                    if(infoHave.length==0||infoHave==undefined){
        
                        sqlmap.query(`INSERT INTO school_settings (h_name, h_msg, p_name, p_msg, s_name, s_msg)VALUES( '${h_name}', '${h_msg}','${p_name}', '${p_msg}', '${s_name}', '${s_msg}')`, (err, next)=>{
                            if(err) console.log(err.sqlMessage);
                            else res.send({msg: 'Updated'})
                
                        })
                
        
                    } else {
                        sqlmap.query(`UPDATE school_settings SET h_name='${h_name}', h_msg='${h_msg}', p_name='${p_name}', p_msg='${p_msg}', s_name='${s_name}', s_msg='${s_msg}'`, (err, next)=>{
                            if(err) console.log(err.sqlMessage);
                            else res.send({msg: ' Updated'})
                        })
                    }
                    
                })
                
              
        
        


    }, 


    admin_school_img_post:  (req, res)=>{
      const {h_name, h_msg, p_name, p_msg, s_name, s_msg}= req.body;

          sqlmap.query(`SELECT * FROM school_settings ORDER BY ID DESC LIMIT 1`, (errHave, infoHave)=>{
              if(errHave) console.log(errHave.sqlMessage);
              if(infoHave.length==0||infoHave==undefined){
  
                  sqlmap.query(`INSERT INTO school_settings (h_name, h_msg, p_name, p_msg, s_name, s_msg)VALUES( '${h_name}', '${h_msg}','${p_name}', '${p_msg}', '${s_name}', '${s_msg}')`, (err, next)=>{
                      if(err) console.log(err.sqlMessage);
                      else res.send({msg: 'Updated'})
          
                  })
          
  
              } else {
                  sqlmap.query(`UPDATE school_settings SET h_name='${h_name}', h_msg='${h_msg}', p_name='${p_name}', p_msg='${p_msg}', s_name='${s_name}', s_msg='${s_msg}'`, (err, next)=>{
                      if(err) console.log(err.sqlMessage);
                      else res.send({msg: ' Updated'})
                  })
              }
              
          })
          
        
  
  


}, 

admin_school_img_post: async (req, res)=>{
 const jsondata= (JSON.stringify(req.body));
  const imgrole= JSON.parse(jsondata).imgrole;
  if(req.file.size<1048576){

      await sharp(req.file.path)
       .jpeg({ quality: 50 })
       .toFile(
           path.resolve(path.resolve(req.file.destination, 'resized', imgrole+'.png'))
       )

  fs.unlinkSync(req.file.path)
  
    
      }
  
    
    else {
      await sharp(req.file.path)
      .jpeg({ quality: 30 })
      .toFile(
          path.resolve(path.resolve(req.file.destination, 'resized', imgrole+'.png'))
      )
    
      fs.unlinkSync(req.file.path)
    
      
        }
  
  //  const randomString= Math.random()*900000000;
  
  // sqlmap.query(`UPDATE school_settings SET  ${imgrole}='${imgrole+'.png'}'`, (err, next)=>{
  //     if(err) console.log(err.sqlMessage);
      
  // })

  res.send({msg: "Added Successfully!", alert: "success"})
}




}

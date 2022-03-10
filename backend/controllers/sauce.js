const Sauce = require('./../models/Sauce');
const fs = require('fs');


exports.getAllSauces = (req, res, next) => {

    Sauce.find().then((
        sauces) => {
        res.status(200).json(sauces);
    }
    ).catch(
        (error) => {
            res.status('400').json({
                error : error
            });
        }
    )

};

exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce);

    const sauce = new Sauce ({

        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat : sauceObject.heat,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        userDisliker : []
    });

    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));

};


exports.getOneSauce = (req, res, next ) => {
 
    Sauce.findOne ({

        _id : req.params.id,

    })
    .then((sauce) => {

        res.status(200).json(sauce);


    })
    .catch((error) => {

        res.status(404);
    })

};

exports.likesSauces = (req, res, next ) =>{

    Sauce.findOne ({
        _id : req.params.id
    })
    .then((sauce)=>{

        const likeStatut = req.body.like
        const userId = req.body.userId
        
        const searchUserLike = sauce.usersLiked.find(user => user == userId)
        const searchUserDislike = sauce.usersDisliker.find(user => user == userId)

        console.log('Like :'+searchUserLike)
        console.log('dislike : '+searchUserDislike)


        switch (likeStatut) {
            case 1 : 
            //Ajout d'un nouveau like

                if (searchUserLike == undefined && searchUserDislike != undefined){

                    sauce.usersLiked.push(userId)
                    sauce.likes += 1
                    
                    sauce.usersDisliker.remove(userId)
                    sauce.dislikes -= 1
                }else if (searchUserLike == undefined){
                    sauce.usersLiked.push(userId)
                    sauce.likes += 1
                }

            break;

            case -1 :

            //Ajout d'un dislike

                if (searchUserDislike == undefined){
                    sauce.usersDisliker.push(userId)
                    sauce.dislikes += 1
                }
                
            break;

            case 0 : 

                //Si 0 alors 2 possibilités l'utilisateur veut supprimer son like ou un dislike

                if (searchUserLike != undefined){

                    sauce.usersLiked.remove(userId)
                    sauce.likes -= 1
        

                }else if (searchUserDislike != undefined){

                    sauce.usersDisliker.remove(userId)
                    sauce.dislikes -= 1
        

                }else {
                    res.status(500).json({ message : 'Erreur l utilisateur n existe pas ni en like ni en dislike' });
                }
                console.log(searchUserLike);
                console.log(searchUserDislike);

                break;
            }


        sauce.save()
            .then(() => res.status(201).json({ message: "Mise à jour"}))
            .catch(error => res.status(400).json({ error }));
        })
    .catch((error) => {
        res.status(404);
    })
  
}

exports.modifySauce = (req, res, next) =>{


    const sauceUserId =(req.body.userId);

    Sauce.findOne({

        _id : req.params.id,
    })
    
    .then((sauce)=>{

        //on test si l'utilisateur est le propriétaire
        if (sauceUserId == sauce.userId) {

            const sauceObject = req.file ?
            {
              ...JSON.parse(req.body.thing),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };
            
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Mise à jour de la sauce !'}))
            .catch(error => res.status(400).json({ error }));
        }else{
            res.status(403).json({message : "unauthorized request"})
            console.log("Erreur de connexion")
        }

    })

    .catch(() => {
        res.status(404);
    })

}

exports.deleteSauce = (req, res, next) =>{

    Sauce.findOne({

        _id : req.params.id,
    })
    .then((sauce) => {
        console.log(sauce);
        const filename = sauce.imageUrl.split('/images/')[1];
        console.log(filename);
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
              .catch(error => res.status(400).json({ error }));
          });

      })
      .catch(error => res.status(500).json({ error }));

}



 


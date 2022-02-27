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

        _id : req.params.id

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

        console.log(likeStatut);

        Sauces.findOne ({

            _id : req.params.id
        })

        .then((sauce) =>  {

            console.log(sauce)

            switch (likeStatut) {
                case 1 : 
                //Ajout d'un nouveau like

                sauce.usersLiked.push(userId)
                sauce.likes += 1

                break;

                case -1 :

                //Ajout d'un dislike
                
                sauce.usersDisliker.push(userId)
                sauce.dislikes += 1

                break;

                case 0 : 

                //2 possibilités 1 like ou un dislike à supprimer
                // Tester si il existe un like ou un dislike 
                //test si l'utilisateur a un like

                const searchLikeUser = false
                for (userLike of sauce.usersLiked.lenght){
                    if (userLike == userId){
                        searchLikeUser == true
                    }
                }
                //recherche dislike
                const searchDisLikeUser = false

                for (userDislike of sauce.usersLiked.lenght){
                    if (userDislike == userId){
                        searchDisLikeUser == true
                    }
                }

                if (searchLikeUser == true ){
                    
                    sauce.usersLiked.remove(userId)
                    sauce.likes -= 1
                }else if (searchDisLikeUser == true){
                    sauce.usersDisliker.remove(userId)
                    sauce.dislikes -= 1
    
                }else {
                    console.log("Erreur l' utilisateur n'existe pas ")
                }

                break;
            }

            console.log(sauce)


            sauce.save()
            .then(() => res.status(201).json({ message: 'Mise à jour !'}))
            .catch(error => res.status(400).json({ error }));
        

        })
        .catch((error) => {

            res.status(404);
        })
      
    })


}

exports.modifySauce = (req, res, next) =>{

    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Mise à jour de la sauce !'}))
    .catch(error => res.status(400).json({ error }));


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



 


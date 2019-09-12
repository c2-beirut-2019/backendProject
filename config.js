module.exports = {
  mongodb: {
      //database: 'mongodb://localhost:27017/AnimalHouse',
      database: 'mongodb://admin:d2RtE28MUV9AZXqc@localhost/AnimalHouse?authSource=admin',
      options:{}
    },
    port:4444,
    awsConfig:{
          accessKeyId: "AKIAVJHRHZ5234PLJVVD",
          secretAccessKey:"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",
          region:"eu-west-1",
          bucket:"animal-house-s3",
          ACL : "public-read",
          AWS_LINK : "animalHouse/",
          LINK:'https://s3.eu-west-1.amazonaws.com/animal-house-s3/'
      },
      mail: {
              email: 'animalhouseteam1@gmail.com',
              password: 'animalhouse0000'
          },
};

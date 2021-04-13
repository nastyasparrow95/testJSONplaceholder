import request from "../config/common.js";
import {expect} from "chai";

describe('API tests JSONplaceholder', () =>{
    let userId;
    let posts = [];
    let emails = [];

    it('Should search for user with username "Delphine"', async () => {
        return await request
            .get(`users?username=Delphine`)
            .then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.not.be.empty;
                expect(res.body[0].username).to.be.eq('Delphine');
                userId = res.body[0].id;
            })
    });

    it('Should search posts written by the user', async () => {
        return await request
            .get(`posts?userId=${userId}`)
            .then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.not.be.empty;

                let stringified = JSON.stringify(res.body);
                let parsedObj = JSON.parse(stringified);

                parsedObj.forEach(obj => posts.push(obj.id));
            })
    });

    it('Should fetch comments and validate authors emails', async() => {
        return await posts.forEach(post => {
            request
                .get(`comments?postId=${post}`)
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.be.empty;

                    let stringified = JSON.stringify(res.body);
                    let parsedObj = JSON.parse(stringified);
                    parsedObj.forEach(obj => emails.push(obj.email));

                    emails.forEach(email => {
                        expect(email).to.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
                    });
                })
        })
    });
})
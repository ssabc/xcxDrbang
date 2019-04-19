    // for (let kx in catsBrief){
    //       if (catsBrief[kx].list[shu].list[rouList].imgPath) {
    //         delete catsBrief[kx].list[shu].list[rouList].imgPath
    //       }
    //       if (catsBrief[kx].list[shu].list[rouList].desc) {
    //         delete catsBrief[kx].list[shu].list[rouList].desc
    //       }
    //       if (catsBrief[kx].list[shu].list[rouList].sun) {
    //         delete catsBrief[kx].list[shu].list[rouList].sun
    //       }
    //       if (catsBrief[kx].list[shu].list[rouList].water) {
    //         delete catsBrief[kx].list[shu].list[rouList].water
    //       }
    //     }
    //   }
    // }
    // console.log(JSON.stringify(catsBrief))

    // for (let kx in catsBrief){
    //   if (catsBrief[kx].baseInfo) {
    //     delete catsBrief[kx].baseInfo
    //   }
    //   for (let shu in catsBrief[kx].list){
    //     if (catsBrief[kx].list[shu].baseInfo) {
    //       delete catsBrief[kx].list[shu].baseInfo
    //     }
    //     for (let rouList in catsBrief[kx].list[shu].list) {
    //       if (catsBrief[kx].list[shu].list[rouList].desc) {
    //         // delete catsBrief[kx].list[shu].list[rouList].desc
    //         let desc = catsBrief[kx].list[shu].list[rouList].desc
    //         let start = desc.indexOf('<a href=\"/file/'), end = desc.lastIndexOf('<a href=\"/file/')
    //         let imgsStr = desc.substring(start, end), imgs =  imgsStr.split('<a href=\"/file/'), lastImgStr = ''
    //         for(let i=0; i< imgs.length; i++) {
    //           if (i<8) {
    //             lastImgStr += '<a href=\"/file/' + imgs[i]
    //           }
    //         }
    //         // console.log(lastImgStr)
    //         catsBrief[kx].list[shu].list[rouList].desc = desc.substring(0, start) + lastImgStr + desc.substring(end, desc.length) 
    //       }
    //       if (catsBrief[kx].list[shu].list[rouList].bgImg) {
    //         delete catsBrief[kx].list[shu].list[rouList].bgImg
    //       }
    //     }
    //   }
    // }
    // for (let kx in catsBrief){
    //   for (let shu in catsBrief[kx].list){
    //     for (let rouList in catsBrief[kx].list[shu].list) {
    //       if (catsBrief[kx].list[shu].list[rouList].imgPath) {
    //         delete catsBrief[kx].list[shu].list[rouList].imgPath
    //       }
    //       if (catsBrief[kx].list[shu].list[rouList].sun) {
    //         delete catsBrief[kx].list[shu].list[rouList].sun
    //       }
    //       if (catsBrief[kx].list[shu].list[rouList].water) {
    //         delete catsBrief[kx].list[shu].list[rouList].water
    //       }
    //     }
    //   }
    // }

    // for (let kx in catsBrief){
    //   for (let shu in catsBrief[kx].list){
    //     for (let rouList in catsBrief[kx].list[shu].list) {
    //       if (catsBrief[kx].list[shu].list[rouList].desc) {
    //         let s = catsBrief[kx].list[shu].list[rouList].desc.indexOf('src=\"/file/'), e = catsBrief[kx].list[shu].list[rouList].desc.substring(s).indexOf('\" />') + s
    //         catsBrief[kx].list[shu].list[rouList].bgImg = app.globalData.imgDomain + catsBrief[kx].list[shu].list[rouList].desc.substring(s+6, e)
    //       }
    //     }
    //   }
    // }
    // for (let kx in catsBrief){
    //   for (let shu in catsBrief[kx].list){
    //     if (catsBrief[kx].list[shu].list) {
    //       delete catsBrief[kx].list[shu].list
    //     }
    //   }
    // }
    console.log(JSON.stringify(catsBrief))
const moment = require('moment');


module.exports = {
    select: function(selected, options) {
        
        return options.fn(this).replace(new RegExp( 'value=\"'+ selected + '\"'), '$&selected="selected"');

    },

    paginate: function (options) {

        let output = '';

        if(options.hash.current === 1){
            output += `<li class="item disable"><a class="link">First</a></li>`;
        }else{
             output += `<li class="item"><a href="?page=1" class="link">First</a></li>`;
        }

        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

        if(i !== 1){
            output += `<li class="item" disable><a href="?page=1" class="link">...</a></li>`;
        }

        for(; i <= (Number(options.hash.current) + 4 ) && i <= options.hash.pages; i++){

            if(i === options.hash.current){
                 output += `<li class="item" active><a class="link">${i}</a></li>`;
            }else{
                 output += `<li class="item"><a href="?page=${i}" class="link">${i}</a></li>`;
            }

            if(i === Number(options.hash.current) + 4 && i < options.hash.pages){
                output += `<li class="item" disable><a class="link">...</a></li>`;
            }
            // maybe the dots
        }


        if(options.hash.current === options.hash.pages){
            output += `<li class="item" disable><a class="link">Last</a></li>`;
        }else{
            output += `<li class="item"><a href="?page=${options.hash.pages}" class="link">Last</a></li>`;
        }

        return output;

        console.log(options.hash.current);
    },

    // function for Date Format 
    generateTime: function (date, format) {
          return moment(date).format(format);
    }
};
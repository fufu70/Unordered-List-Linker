# Unordered-List-Linker
Sass mixin example that allows a line to connect the next bullet in a unorderd list

## Installation

To add the project with bower simply run:

```shell
$ bower install 'git://github.com/fufu70/Unordered-List-Linker.git'
```

## Usage

Once the repo has been installed you can import the `unordered-list-linker` file into your respective sass file with a specific namespace:

```sass
@import "path/to/unordered-list-linker";

.hero-unit {
    @include unordered-list-linker(
        url("/example/images/tall-rectangle.svg"), /* linker-image */
        15px,                                      /* linker-image-left-offset */
        35%,                                       /* linker-image-size */
        -5px,                                      /* linker-image-top-offset */
        #555,                                      /* bullet-color */
        16px,                                      /* bullet-offset */
        34px,                                      /* bullet-size */
        23px                                       /* bullet-top */
    );
}
```

The variables above are the default variables for the `@mixin`. The linker-image is used as the repeated pattern for linking two bullet points. All other values are used to set the linker-image in the center of the bullet points. The resulting class naming is based off of [SMACSS](https://smacss.com/) to easily give unique CSS styling to a starter namespace. The namespace in the example below is `hero-unit`.

The html structure is as follows: 

```html
<div class="hero-unit">
    <div class="hero-unit__unordered-list">
        <div class="hero-unit__bullet"></div>
        <div class="hero-unit__item">
            <h4>Hero One</h4>
            <p>Et harum quidem rerum facilis est et expedita distinctio. </p>
        </div>
        <div class="hero-unit__clear"></div>
    </div>
    <div class="hero-unit__unordered-list">
        <div class="hero-unit__bullet"></div>
        <div class="hero-unit__item">
            <h4>Hero Two</h4>
            <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
        </div>
        <div class="hero-unit__clear"></div>
    </div>
</div>
```

![alt text][example]

## Testing

To test the repository clone the repo, install gulp and bower globally, install npm packages, install bower packages, and run the gulp server:

```shell
$ git clone https://github.com/fufu70/Unordered-List-Linker
$ cd Unordered-List-Linker
$ npm install --global gulp-cli bower
$ npm install
$ bower install
$ gulp serve
```

[example]: https://raw.githubusercontent.com/fufu70/Unordered-List-Linker/master/common/example.png "Example"
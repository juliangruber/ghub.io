# ghub.io

The code behind [ghub.io](http://ghub.io/).

## What

Redirect to a <a href="http://npmjs.org">npm</a> package's <a href="https://github.com">GitHub</a> page, if available.

### Usage

http://ghub.io/<strong>&lt;package-name&gt;</strong>

#### Usage as fast way from Terminal

Add this function to your `.bashrc`

```
function module() {
  open "http://ghub.io/$1"
}
```

From terminal `module colors`

### Example
[http://ghub.io/review](http://ghub.io/review)

## Help

Help me pay for hosting by tipping me on [gittip](https://www.gittip.com/juliangruber/).

## License

(MIT)

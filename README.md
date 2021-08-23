# Encoders ![npm](https://img.shields.io/npm/v/encoders)

Transform data in a functional fashion, inspired by [decoders](https://github.com/nvie/decoders/).

## Motivation

In a DDD environment, you're going to send domain objects to your clients, via
some API, maybe to interact with some third party. However, you might need to
transform the actual shape of the data :

```ts
type User = {
  name: string;
  address: string[];
  postalCode: string;
}

const user: User = {
  name: 'John Doe',
  address: ['Street', 'City'],
  postalCode: '75000'
}

JSON.stringify({
  full_name: user.name,
  address: user.address.join(', '),
  postal_code: user.postal_code
})
```

This module provides an elegant API to express those transformations in a
functional fashion. It provides reusability as every transform is a
composition (FP speaking) of a pure functions :

```ts
type Encoder<I, O> = (in: I) => O
```

You could rewrite the previous example that way :

```ts
import * as e from 'encoders';

type User = {
  name: string;
  address: string;
  postalCode: string;
}

const UserEncoder = e.object<User>()
  .rename('name', 'full_name')
  .rename('postalCode', 'postal_code')
  .map('address', (address) => address.join(', '))
  .encoder;

const user: User = {
  name: 'John Doe',
  address: ['Street', 'City'],
  postalCode: '75000'
}

e.toJson(UserEncoder, user);
```

> :exclamation: **Heads up!** Don't forget to enable _strict mode_ in your `tsconfig.json`.

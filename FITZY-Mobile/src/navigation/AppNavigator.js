import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { Image, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import HomeScreen from '../screens/home/HomeScreen';
import CatalogScreen from '../screens/products/CatalogScreen';
import ProductScreen from '../screens/products/ProductScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import StylistScreen from '../screens/ai-stylist/StylistScreen';
import ReviewScreen from '../screens/reviews/ReviewScreen';
import PostsScreen from '../screens/posts/PostsScreen';
import PostScreen from '../screens/posts/PostScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminManagementScreen from '../screens/admin/AdminManagementScreen';

const TAB_ICONS = {
  home: {
    active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMvSURBVHhe7ZohdBRBDIYrkZi7ZNYsZ3hIJLKKV4msRCKRSFxlJRJZWYniVVaieMiTlcgaePDCm+XtZmdnJnObvbm7fO/FbDPpn7mdJHu3Z2eGYRiGYRiGYRwwzrn3iLhFxAdEvGrb9gn3OUnatn2KiDeI+IfZ/Wq1Qu5/UjjnXgDAj8DmdPYTAM75upMAAC4B4DGwKSMDgI98/dFCtQUAPvFNSBkAfKHjyOMdFQDwjGoLT95vwKMv1Bd0tPjfvW3X6/UrHvcoSCT+0E88tZGI+G4Y/cChGsIT7dld6OhkHMWbgx8FfAu/CyT3z3KKb6yYUwekTsjXHAR0ZPzQN0rMH7ULvmaKxDhAo8AlX1M1VGynPnWqLVRj+JoUkYGys+vqj1wqCaopuyaR2vxqp+/YMaCE5jwGqeNb3fS9j0I6RwNQJ7MVj1r4nMRGiL1O36lhjmoFX6NFYghdfvpOCBpMxUuR+sAWm75jtzQi/m6a5jlfsxSbzQYA4FdAV2d603eqKHa2zw5C/5vr4abSNBJtlQuoeoO8zTd9U72JtPDvgWu1bdDXwLVO6wceQwSd16k7h9q7c+514HpVG0TXpqZvurbz5M27VX8qnhLEYyxFTM9UmSh5LhzQ71q8wMUE7YOUnkCjuR1GKIQ2pWmal/x6SlAOFNdP49/6HwS1ZOfcG+4fI1cP3TWhfGYnV1AIX9+u+Hpu9LiQWyd20aNCqSC/Of/vmAzb5tSKUj1qlApKPOBO2T2PwynVo0aJIN9NePJkdJfQxl1Pfa+Uep4q0aNKiSBE/BxYM/qmkYY47kfHsu/DKdGjSokg/wZHf82Wb04HtWEeP/b9TokeVaSC/Bwy8Kcjxf06AOAt94/Fl+pRRyoo5B+bdUL+0vgxf3WkgmrzV0cqqDZ/daSCavNXRyqoNn91pIJq81dHKqg2f3WkgmrzV0cqqDZ/daSCavNXRyqoNn91pIJq81dHKqg2f3VCgvxvUOch8+9BZyegHV+dUAJSiyWgHV8d7QS046vj38kZiZJY7E0L7fiLEPqOOdfoNy8ej6MdfxH8G66johkzyS+b2vENwzAMwzAMwzAW5i9+OsMe9MU9FwAAAABJRU5ErkJggg==',
    inactive: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANXSURBVHhe7ZsxbNNQEIY7MrLB2AkxMjJmQh0ZO3Zk7MjIxtgREbuy8l5UJETeiSkTYuzIhDpmZGTMAgKd3YB9fn7P78XnvCT3Sbe4967/PfvdnZP25EQQBEEQBEEQhD1mOoPLXJtVpuFHPoe3RVE8oD5HSVHAw0zDh1zDn4YpuC2Kj4+p/1Hxvvj0NNdw19qce8u0+ZlpmNB1R0GuFueZhjXdFJtlGt7Q9QcL1pZrDe/oJvSwJR5HGu+gKAo4xdpiSR6fkjUW6kwtzvBo0Z9XZlZTvXhO4x4ErsSxc9UT92+kedWMvudgDaGJ/jNlvtqOju8oYufb+1EAE8cNoMnVkvQWX08xv8NOSNfsBXhkyqGvnVTVvtXijK7pwjUOlMdWLc7pmqQpi23XXS8HQDila3x0DpQbm5ur5I+cLwmsKdsm4d/8RKdv9zGA9ZDHwHt8U5u+d1FIh2gA7PRrxe0WPiTOEWKX07d/mINLuoYL1xC6k+m7U5BqT8VjYb1hqn7DRpq+PY/079nMPKFrxuLm5vOjTMEvi67NRvFN376iWBOxsw6Cv5vqsdjwTcPVVqntwQYNO31X9cbewrMZfG9dS2yDMg1f6LX/+s1rGiMIPK9dT07V3s0Lej3BDZp0Td94bevJm3ar+lTcJYjGGAuXnq4yEfNe2IB0rUaBcwnaBT49tNFk2kAzQiS4KdM5PKPXfYL6gHHL46rMt/qNKF96Fbyk/i766sGnxpbP4PQVZAPrG35BSNdbbNm3Tmyjh4VYQeXmNJ8Yj5lVn1oRq4eNWEGuF9xOU3BL41Bi9bARIwi7CV1TmVmVGzc3V12fK/nep2L0sBIj6Fqbgq6xfdKIQxz1w2NZ96HE6GElRhA+Kc01WF/sL5DYhml81+c7MXpYCRVUziHEH48U9duQK7ig/q74oXrYCRVk83fNOjb/0Pguf3ZCBaXmz06ooNT82QkVlJo/O6GCUvNnJ1RQav7shApKzZ+dUEGp+bMTKig1f3ZCBaXmz06ooNT82QkVlJo/O6GCUvNnxybo/juoic2qf1jpnwB3fHZsCYSaKwHu+OxwJ8Adn53yb3IsokLM9ZcW3PFHwfYZc4AtaTwKd/xRwLtEC6bPQr7Z5I4vCIIgCIIgCIIwMn8BVlMviEBCtV0AAAAASUVORK5CYII=',
  },
  catalog: {
    active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAK4SURBVHhe7ZkvcBVBDIcrkZj3knvmkEgkshKJRCKRyMq6SiSyElmJRFZWIisrKyvLpLNnfuT+7GX3NwyTbyamL7ffTnN3u7c5O0uSJEmSJEmSJPk3EZE3InKhqr9U9RniVlW/DcPwFq/bC9sXwiYqIk/ORL24GsfxFY5RA9u3G6tQqRZOajFE5PfxeHyP463B9oUok33EyWyNcgd8wHHnYPvCLFTyQVWvReSyxHdVvXfyXnIPh4Pi2B5sX4jyckS5xfU4jq8x31h4b/zAXITtC3E6nd554mEYPmIuYo9J7bVsXxi7jVFotzXmzaGqX/B6Vb3BvAm2L4yq3oHsoXYZdca4x5wJJ7erLwxWo6aaE7Y3wXHm3iWY19sXwlYAFNktjHlr2DsAxxGRc8xj+8LY9t4Rfca8NWw/4ozz14TZviY4okvMWcNbtu2fgXmGk9fVF8bZhN1hzhq2isAYj5gzwfaFsc2ZU43Nt719EznX/8S8CbYvjPc8W0W2bOFtebYPR7x+GIavmDvB9jXBtusoLd9Esx+DVklvsva3tX0N2xemLL82QZy0xU35Djq3sGp5j8kUW44h2L4miMgnlO+IKxx3DravCVYt72NwY1RPlu1rQu0pX/R0j+1rhi29doC+UGH77aLVC5Lta0o5h3l5adp5Dv7eGrYvSZIk+d9g98rZvhALPSgvwr1ytm83tbvaKfbubtm+EOxeOdsXZqGSXXrlbF8I7xC8RJdeOdsXgt0rZ/vCsHvlbF8Yp8/dtVfu5Hb1hcFq1FRzoqZXjnm9fSHYvXK2Lwy7V872NcERde2VO3ldfWGcTVjXXjnbF8ZrytXc9rW9crYvjPc89+yVs31NYPfK2b4w7F4529cEdq+c7WsCu1fO9jWh9pQverrH9jWD3Stn+5rC7pWzfUmSJEmSJEmSbOEPIYBJ8A9w+DkAAAAASUVORK5CYII=',
    inactive: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALfSURBVHhe7ZkhbN0wEIYLBwcLBwcLBwsLBwcHBwcLywoLp76ksl4cadK0Z8PBwcHCwcHBBwc33esLeH+cJc7Zv6bpPsmkvfhze4lz8Z2dGYZhGIZhGIZh/Js4F18023DdduFr6+Pvk9HFb20f7u7d55d43VrYPhWy0MbHX6OFpkYfb51zz3COHNi+1UiGDtnCRc2P7xu/e4XzzcH2qZDFNj7sE4tZNOQOaLrdFc47BdunZiqTjY8/H3xwjY83Mh58/ND68APjhljnPp3j3CnYPhWHzTGxAFmoc/E5xgtT+0bj40eMRdg+FZs+XqTEbRdfYyzy9JjkXcv2qZHbGIVyW2PcFJtteIfXNz5EjBtg+9S0XXg8lclznfcaxTlkz8CYAYyt7VOD2cjJ5oDUJjjP1F6CcbV9KuQNgCK5hTFuDtkDcJ7Gx0uMY/vUSHmPoraLbzFuDqlHcJ7Ugtm+IiRENxgzR+q1Lf8MjBMwrrZPzagI68Ijxswhb5HTPzrsMWaA7VMjxRlmI+e2l2+i0fU+fsG4AbZPTfp5DvslJby8nuXDEa/fbON7jB1g+4og5TpKpT7528fgMZOjxcrP5uoatk+NZE8WmJAfqtTjd9ClDMlW8jE5jiXHEGxfEdpu9wbl2aOPtzjvFGxfESRbyY/BJWPFYtm+Iqw45VOd7rF9xZBXrxygT2ZYfrcN16U2SLavKMdzmKdNs48X+PvSsH2GYRjG/wa7V872qZjqQSVHgV4527eaFVXtMFZVt2yfCnavnO1TM5XJWr1ytk9F6hBcRq1eOdungt0rZ/vUsHvlbJ8a7HPX7pVjbG2fGsxGTjYHcnrlGFfbp4LdK2f71LB75WxfERKiqr1yjKvtUzMqwir3ytk+NcmmXMZtn9srZ/vUpJ/ner1ytq8I7F4526eG3Stn+4rA7pWzfUVg98rZviKsOOVTne6xfcVg98rZvqKwe+Vsn2EYhmEYhmEYS/gDxXc0KI9Sv0AAAAAASUVORK5CYII=',
  },
  favorites: {
    active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOwSURBVHhe7ZshdxsxDMcLB0cS6UJucHBwsLBwcLAfYXCwrDBwMLCwsLAwMHCwMLBwsHv/Pd12UeQ7X872XTL93hNpdD5btiVZvl5dOY7jOI7jOI7jOI7jOH1UVfWRiO6Y+VnJhoi+av1YlsvlZ2ZeG+2u8ZvWnxWLxYKZ+Z6ZX5j5rUf2GBQMqdvRoF0i+k5EP412tKDdTUy7RSGia2Z+NTocI+u6rt/pNoEY5pfxTKfgmTErNSlVVX3THTxBnuu6ft+0CYMx84OhN1TWh70tDBH9MDrVFiz5tq/Qv7flZbVafYKhmHlr/N6WXavNzi1NRE+hFZqVqqq+6M5Ih7Al1th2+pnGn3QMCtsUg9d/h+wxIZZ/kaCAdjEh+rk3rHL9THYCA9nHRhOJcvp5U2QV/N2CIWT1Ha1UTBomR+tnw1o9iDJDOwFHGuGEB/uRgP8a3M5JiAM9WsrwH1o3hh4n/6j1Y5CU4yCqYiJO7eMgmPkm1UAADG7lOBiQ5W9iCRg+/yqSTPbgxWNnxtqyYwcTWOk7rZccwzknealKGZAXjQ7NyKq14WOc/SgMpzpqphtkq11DUhgHIAhoAxHRB62XFP3CSXKMSOQIdNDf2DTkJGB9/UIiutV6cwG+0ejvUQKbDDdQBMYL77TOXLCi49iI24txjtponblg5ULZo5hx1tlqnbmgwzwisNZJjn4pZOgZrASSKOoiXv7JtHKLOYZ6y/8U6WdgZpJk0ymxTvTFVrq1zTBjWm8qEKmMjP9Z62XDylBxIk91RBgLqgtG/8rma1YniuzxHqzJQ2pSfPKsLBXlhWL73CBUW5ps+wduNcrtdUWgP9MFEKu0CZni+BGodOY/WvQB56c7hQiStaygkInS1UPIvdadBCvsyz1W3uLUv7zMumjcFnfMIeQ+Sh9im9Cf9XBoRdOxBf8sYEsZyRk6m+3q17pAkHeWzXlisc5pIslLIh03s0lq5NmQO3Ld6aRG6jDOyfdzRQk47SRG6jDOfJxyH5LRPhmDGGWkDuPscgeD5PQY6WHobMvnfbqd8zROQ4+RDr4qCyF5TmjLnq9xGrqMhDypK5nE4EPPXoRxGmQVHCV0InvrvCTHB/0dQCNwyJdhnDahxE4OvDeNnpRSjjJzkceh/uussO6qIPLp7m3XJ8UoZ+j2LhIUsKxjSZfMoVpZFPm3AnOltGVWH4WXBifuDl8Dec3+scHckVKJFa3+fFiu9f9LjDRgO2Xxf7YgafRV4ziO4ziO45wFvwHejVrStOzf9QAAAABJRU5ErkJggg==',
    inactive: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPfSURBVHhe7ZqhctwwEIYDCwsLCwsLCwMLCwvzCIWFYYUHMz0744l1M53p9CQYGBgYGBh4MLCwnV+yG2e1OttnSfal+80suVvL8kraXa10ciIIgiAIgiAIgiAIgiD08b369a5Q5rys9U1XLpWuynr7meoPZa22H8qNXtF28Rv+o/qLoqp+vik35lup9EOpzJ99Uiizw0fBkLQdCtotrvTXUpl72g4VtItBGNJuVgplTgulH2mHB8lGr6qqekXbBDBMocxv75kesc9MmKlRWV+ZL7SDo6XWN1VlXrdtwmCFMj88vbGy0avnvc3MpTIXXqc6YpdS11cwOk+iH9Yb8x6GKmtz6//fkVrfPbXZu6SvQzM0KWVtPjGdcdN7o1dYdvSZJ3/Cf5Rdpvh49j/4F3PB+RcbFNxy3NHnIJjl9JnkcB+CDg6NJjbKMR8TkOvuEgzhZp8/UzFoGByqn4zA7Lkf2wk40l4nfIAfYf3XAe0cRONAvakM/0F1h7DPyRdKG6o/BLuUSVTFQBzax1EU9fZjrA8BMDiX4+CDOH8zFNbwOWaRzWTJi6eODLtkJ34MO9NrfUf1ouM550gvfZYy2Lxoemi2Wxti+CHOfhKeU5040i3NiJ9CYhgHIAgwBnpL9aJCXzhLjjEQGNvr78A05CBgffrCsjZnVG8pwDfS/nIJbDTEQANgXnhOdZYCFx2nRtxe6D4KkYLqLAUuF0oexby9Tm1uqc5SoGEeEZjqRIe+1I3KuD1YDlzaQIp4OQaTyy2WGOpZ/5Ojn/zIxMmmY8Lt6LPNdG6ZYcSo3lwgUnkZf61vqF4yuAzV1YPibBGmguqC17/c+RrXiSxrvAd+8PRD9sELZKm7bOucIVRbmm35s6caOdc6IdCf+QIIV9psZlL27QdX6YQk31r0AedHO2XrvynLCgQ3UH6dHEfhVHcWuLDv/FHi4lTrd7iDxtrcZnfMIex5FH8YeJ96c8hF06kF/yRgSXnJmZNkR7/cAYKV3DnPULh9GiRFSSR4MhupRp6M5i6P1/GYRgoZZ8r5XFY4px3LSCHjLMop99FktNfeR0w0Utg4+i51MIjOPiOhFDF2tN31Pr+tozROyz4j0VtlIdBGaMketXFa9hrJ5UnBZNLlV4FnX4JxWpoqpJfQQeylK2a/ZG/N0nsA/4wDh/xCjNMllNhhw4vNZqvnSilsZm5D+Vj/dVRwZ1Xuw3F115ztu1KMcgZt70WCAlZgWxKUJVQrs+L2bvxM6cqiLoXnBjvukK9xxtGPyS8bLJ3m6i4TrdzFcqr/X+KlATaMz1f8XyxIGmXWCIIgCIIgCEfBX76NbKypdskjAAAAAElFTkSuQmCC',
  },
  cart: {
    active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMCSURBVHhe7ZshcBsxEEUDC0vs/TJxYWFhYWFgYFCnsLCwoKAssDCwZYGBhYGGgYWGhoaB7mxHnnH+rR3nom/rXL2ZJZ61/tf6TtbdrM7OGo1Go9FoNBoHJ6V0AeAngDsAK4oZgBszu5xOp6/4uydNLswiKMq2WAL4zOOcHNPp9LWZ/Q4KsG/MUkpvedyTwCcGYB5M+rmxHI/H73n8QZOL47cJT/ZfmNkfAFdm9n0dAO45byP/wcw+sM4g8QU2L7idifrnk8nkHX9njZm9MbPr4Hsei9FoBP7O4ADwI5jcKqX0hXO34VfLlivwjnMHhV8dwaS8OBec+xR5rE6R+oxVDQBueUK+vnDevuTtARf8nvMGga8fislERQdwznnV4xs7nkiJ2yG6bX0h57zqCX7pZalHhuDRZM451RNsCm85py95n/ToKqr+L9//ijeDJ2BmvzinbwD4xuMD+LiZw/4Ojq8FeRO3dcd77Mg79JsSa9/e5J3xFZvhSCl1Pjtm+EOy/DbMxXn2FaMoVs8x57794HkVY8dz0ZBixvMqgr9iCMQ8/Fe5NrNPvJgeMS79GTCvQezXo/zLt/xq9JGQF6bU3kaFmX1l3yV29B2Cfc289uKsCTatK3+7yXm98cFYwC9hzqsVv/3Zv9+KnNcbH4wFDrq3eCGRf3mBigqIkfuXC4iR+5cLiJH7lwuIkfuXC4iR+5cLiJH7lwuIkfuXC4iR+5cLiJH7lwuIkfuXC4iR+5cLiJH7lwuIkfuXC4iR+5cLiJH7lwuIkfuXC4iR+5cLiJH7lwuIkfuXC4iR+5cLiJH7lwuIkfuXC4iR+5cLiJH7jwSG1Fka+S9aoHzWggV69zsfmqi/umiBHO5y944tzqmVqCOueCNVdM7L+3A4rzZyL+UDeV9w3ouJGsNzkbzr7Nwv2doiH7Hi4nhoOlN2HGsaUiyK9gZtsuVyHVTI23a8V3FH71/NsTzYmumtd/k4QOf8Vm2Rj296L6XmtnqKfGyys0DWELuOezYajUaj0fjv+Qth6bWxfMRygAAAAABJRU5ErkJggg==',
    inactive: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMzSURBVHhe7ZstjBsxEIUPFhYWFhYWFhYWHjxUFRYeLCg4dvBg1exG29grVaoaDww8GFgYGBhYeLDV7G7U5Nm5/Pml3pw/aUg063me2F6vNb64yGQymUwmk8mcnNLI5dC6qjTuvrTyZ82MTAsr30szvqqq6hk+e9ZoYgorCy8pG6yw7vdg5D5iO2dHVcnz0soEE7CzGZl+rX6+wnbPAu1Yad3c6/Se1owmO36D7fcaTY52DDu7YrOyltvCys3SSuN+Bfy6JMlDYeUtxuklusDq1MBONmZkOqjlNT6zpKrk5dDKF++5NkmLqvrxAp/pHWXt7rBzaoORXKPvJnS0BEegcffo2yt0dHidajoml+i7DW0rnKT920qGwjrBDun6gn67osnA9nStQr9eoOsHozPBpJvxO/RLHt3YYUdiTIfQtNWFHP2SB/9pXT9ifTL4nyZujj7Jg5tCTRj6HEqzT4JRlPwrv30V/zPswMDIN/Q51ErjPvvtj9+v+qC+k6NrQbOJe2THm4DN2hOB49e+nWl2xrXcBsSkbhP6NGw/G3YcMSbwW0Qb1v5v283NdfuB/YrGpu+ijaZJIidqbzMyxX5FQY8YvGCNuXm7FskHXEz/l+kpZPcNOPP16ncg4fCtORqFQJqYWHsbFsXIfULdMXb0Hrivaedz2slZgptWNT3dRL+D6Y5K1/+F2t2hX6ro9Ef9OhXR72CaeY0JOuXe4khC+ukJihqADF0/PQAZun56ADJ0/fQAZOj66QHI0PXTA5Ch66cHIEPXTw9Ahq6fHoAMXT89ABm6fnoAMnT99ABk6PrpAcjQ9dMDkKHrpwcgQ9dPD0CGrp8egAxdPz0AGbp+egAydP30AGTo+ukByND10wOQoeunByBD108PQIauPxigR5WlQf0xE9ReRPECHFzvfGpC9dVRE6QEqtwn6JMqoYq46IVUwXteZnyFfqnRXmGQBxg9C/Q7mmBheFcjpOuRDtnUrLtitZacxliVKRuvNfXI2mtUEWuDVgkN194Zu2ynq1UM1v6lbM1L5lRrppbetVcnvTdbcqYjvq2lJE2rbejrEhfHVOyx656ZTCaTyWSePH8BfPwNBpNObpkAAAAASUVORK5CYII=',
  },
  profile: {
    active: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAN9SURBVHhe7ZotcBtBDIUDC0ts7ZlcYGFhYWBgYWFgYWFgWaFhYKBhYGCgoWFhoKFhYDvPI2fsF+3lfvZ+1tE3o5lMorvL6vbeStq9uHAcx3Ecx3EGpyiK7yJyF0J4CiH8I1uHEFYi8qMsy8987VlTFMWvEMLOCIppIvISQvhz9oFaLBZfReQvB6CB7TDr+L5ngYjc6EzgQTc2Ebnl+2cNgsODJNvgExKR3weL6NKxLfk5WTKfz79VzJx7Ebnkaw5AczRg5vUIPF+TFWVZfgohPPPAoCUicsX+MWazWdBVjQP0gr+xfzboasXB2VbNmhgabHyKfL979s0CHdCbpbzJzGEQWOueWB3Zd/IgweOBpBBWa1ZCp9hv8mDq80BS6QXrGnIr9pk8PAgs2+zTFi1PToKfXZbNA0Cewz5tQTbN9y+K4gv7TRZdljlAP9mvLcit+P5dxH9wdLXhASRL6rBqGffPJ0DAGECy+imEcM33z26pR0JIg1ixT1u0VjsJUKoVcjC42ERZgOSR/dpglB1b9pk8VkKH37FfUyz9ybLcsIQab7rrLIrUY9fslwXQHWMwD+xXF+RSxv027JcNEM5IL+epaeZrCTMs+xYsEkQelNq2zuBUc8zuIkoO9s8Sq3Y6so12Da+0qX+Jn1XkzcCoYRZ20rPJoL2hB2OQbW3d9BPNgpiONDHMxrOZORZVmlJl6PnU0ayzATqj2sQlybGhvbrffubrPxTo5WjAXi274tMZCCSP2hFcqhbtzUgoUZDi94+aBtxk1TVsgn5Cdx0PLuxNA7nKXrCxFOuePLcmUhoEfpldTqTlxZsNvh4Nz0rW8+4NfEoNZwxmADTo5GSHJpToBMT0KWYbNPT5/5oEkVYE27NqEc4KNdqf11MitzWTzPvJtGBr1lmYDcmaWlrQIlhVn/Fu9FwK4vjOG+31TerzkS7wc1+DNNp2kG4OWu3Pfd2Ucsa8h9Z3pvZBv0YJUsXMWY1VbVecg2x1Jqk1sbbFFDp8uqloadOafXvB2hfX4EzmjE7Fucj+c6WI7rTeqeiLSC982+eiYe6J9/7QDkS2nTqfcoti5TujrBA1iWw77XpZRCIPm/ymnSaU/FLTdyit0/Ipz/z0ReTFpt/LNwLUeZ99KAxpSB8g7e886gPGr3MaoCXJYfVFwTxc0ug4juM4juM4juM4jjMt/gNrfj7MsvIR3wAAAABJRU5ErkJggg==',
    inactive: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOwSURBVHhe7ZohcNtAEEUDAwsLCwsLCw0LAwsNCwsNwwoDO7WU0fjkGc9k6lsYaBgYaBhYWBjYzt6dp87XniPJkqxz980sSVYn32pvb3fvLi4URVEURVGUwckNXd2W9D03dpOX9OeFGHrISlrlZv25KOgNPnvWzBf0NSvt74pRIpKV9Jwv6dvZG2q+pA95SVs0QF1xRjV0heOeBbmhqfMEYeJNJVvYGY6fNGwcnOQLMfaRl1BW0vVOxLi0L0t7g+9Jknm5/hjznNvSFkVB7/CZHRxzgsHE59nw+ExSFEVxmZf2CSfGsSQraYL6MYri7i3vatVx6Jn/h/rJwLuVMKlfh7wmhjM2L0UYj70QdZOAJyRt5U08B2HDSmPy7oi6o4cTPJxIF4E14pXXqDd62PVxIl3FCyGubVFn9FQmYewGddriypOK8RPLsnECnOegTls4m8bxfxQ/36PeaHHbMkxgvrBfUK8tnFvh+McE/8Hh3QYn0GVSF2q6dA3EVCbQYf2UmfUnHD+5rZ4TQvjCK9Rpi6vVwEBd7ZCDgcWmLwuKS9RrA5Yd/DFQZ/RICR3/DfWaIsWfJMsNKVD7Ouw4L5LqMY5JqJcErqeMkyktoV5dOJfC8dhgqJcMHDjFXo6xm6aZrxSY/ViJt2A5QaxMKiy3OpNzMSfSXeSSA/WTRKqd/nmAfQxdwwkbw7c0aOKCfMQw4bnNsfFsNITeEFUm2VYMPTRdokkQjSMNhL3xbDxH4lBMeUW2dWLW2cBxhr0BS5J9Cc19d/yMz/9XcC+HDbYvyRWfykCEM64rbuC7WBSkklByQepj1b0/aaVpUl3DJvDEQi7U+uLCTtiQPi4lHrD9QR9NsTXRpbgAv7Q3yeVEXF5IB3x9Cb+ry553b/BSauIxvh6zG7zZEWQVjU8xMfaRG/r4u0aB2IqoiH3yV+5o2vR83t0SWdhZnSTT3xoZSQu2Tp3F3tBlU8sVtAs7O7SM3bI7dS7FwfHQF+37S7r3c7ogvHtnpJMdB/l8ptr+DLLt0mNew9d3cuwLacHwRop5Di+nU1XbsXuQbe8ktSbWthhDh489V4xNhh5Qtxekc/HwlUZzRyd2L3KQXEmKO8ecVPSF1Av3S62/TUM8E+/9pUcgHTt1ccstipTvnGSHqIl07MTxqZdNRHpZCod2LvtGL+qjQynelu/wzk9fSB+2l7N8NFAX5+xDgaGhFwP5W/N0740zgjqnAaEkCruvfRo0aVQURVEURVEURVEURRkXfwE4PiBWvRmmzgAAAABJRU5ErkJggg==',
  },
};

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, focused, badge }) {
  const icon = TAB_ICONS[name];
  const uri = focused ? icon.active : icon.inactive;
  return (
    <View style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri }} style={{ width: 22, height: 22 }} resizeMode="contain" />
      {badge ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: '#181818',
          }}
        />
      ) : null}
    </View>
  );
}

function ShopTabs() {
  const cartItemsCount = useSelector(state => state.cart?.items?.length || 0);

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.ink,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#ffffff',
          borderTopColor: '#ece8e1',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          title: 'Sản phẩm',
          tabBarIcon: ({ focused }) => <TabIcon name="catalog" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Yêu thích',
          tabBarIcon: ({ focused }) => <TabIcon name="favorites" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Túi hàng',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cart" focused={focused} badge={cartItemsCount > 0} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  const isAdmin = useSelector(state => state.auth.user?.role === 'admin');
  if (isAdmin)
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.paper },
          headerShadowVisible: false,
          headerTintColor: theme.colors.ink,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: theme.colors.paper },
        }}
      >
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{ title: 'Dashboard cửa hàng', headerBackVisible: false }}
        />
        <Stack.Screen
          name="AdminResource"
          component={AdminManagementScreen}
          options={({ route }) => ({
            title:
              ({
                orders: 'Đơn hàng',
                customers: 'Khách hàng',
                categories: 'Danh mục',
                products: 'Sản phẩm',
                reviews: 'Đánh giá',
                posts: 'Bài viết',
                promotions: 'Khuyến mãi',
              })[route.params?.kind] || 'Quản lý cửa hàng',
          })}
        />
      </Stack.Navigator>
    );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.paper },
        headerShadowVisible: false,
        headerTintColor: theme.colors.ink,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: theme.colors.paper },
      }}
    >
      <Stack.Screen name="Store" component={ShopTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{
          title: 'Chi tiết sản phẩm',
          headerStyle: { backgroundColor: theme.colors.paper },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.paper },
        }}
      />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Thanh toán' }} />
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Đơn hàng của tôi' }} />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Chi tiết đơn hàng' }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ title: 'Tài khoản FITZY', presentation: 'modal' }}
      />
      <Stack.Screen name="Stylist" component={StylistScreen} options={{ title: 'FITZY Stylist' }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Viết đánh giá' }} />
      <Stack.Screen name="Posts" component={PostsScreen} options={{ title: 'FITZY Journal' }} />
      <Stack.Screen name="Post" component={PostScreen} options={{ title: 'Bài viết' }} />
    </Stack.Navigator>
  );
}
